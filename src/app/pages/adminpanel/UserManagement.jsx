import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2,
  Edit3,
  KeyRound,
  Loader2,
  Power,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  changeAdminUserPassword,
  changeAdminUserStatus,
  createAdminUser,
  deleteAdminUser,
  fetchAdminRoles,
  fetchAdminUsers,
  updateAdminUser,
} from "../../data/adminUsers";
import {
  AddUserModal,
  ChangePasswordModal,
  DeleteConfirmModal,
  EditUserModal,
} from "./AdminModals";

const statusStyles = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  inactive: "bg-muted text-muted-foreground border-border",
};

const roleStyle = "bg-blue-500/10 text-blue-600 border-blue-500/20";

function fullName(user) {
  return `${user.name || ""} ${user.family || ""}`.trim() || "بدون نام";
}

function UserCard({
  user,
  onChangePassword,
  onDelete,
  onEdit,
  onToggleStatus,
  statusLoading,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-3 rounded-lg border border-border/60 bg-card p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {(user.name || user.family || "ک")[0]}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {fullName(user)}
            </p>
            <p className="font-mono text-xs text-muted-foreground" dir="ltr">
              {user.phoneNumber || "-"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="تغییر رمز عبور"
            title="تغییر رمز عبور"
            onClick={() => onChangePassword(user)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-600"
          >
            <KeyRound className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={statusLoading}
            aria-label={user.isActive ? "غیرفعال کردن کاربر" : "فعال کردن کاربر"}
            title={user.isActive ? "غیرفعال کردن کاربر" : "فعال کردن کاربر"}
            onClick={() => onToggleStatus(user)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
          >
            {statusLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Power className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            aria-label="ویرایش کاربر"
            title="ویرایش کاربر"
            onClick={() => onEdit(user)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="حذف کاربر"
            title="حذف کاربر"
            onClick={() => onDelete(user)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleStyle}`}>
          {user.roleName || "بدون نقش"}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${user.isActive ? statusStyles.active : statusStyles.inactive}`}>
          {user.isActive ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {user.isActive ? "فعال" : "غیرفعال"}
        </span>
        <span className="mr-auto font-mono text-xs text-muted-foreground" dir="ltr">
          {user.nationalCode || "-"}
        </span>
      </div>
    </motion.div>
  );
}

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);
  const [statusLoadingId, setStatusLoadingId] = useState(null);

  const loadUsers = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      setUsers(await fetchAdminUsers(signal));
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError(requestError.message || "دریافت فهرست کاربران انجام نشد.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  const loadRoles = useCallback(async (signal) => {
    setRolesLoading(true);
    setRolesError("");
    try {
      setRoles(await fetchAdminRoles(signal));
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setRolesError(requestError.message || "دریافت نقش‌ها انجام نشد.");
      }
    } finally {
      if (!signal?.aborted) setRolesLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadUsers(controller.signal);
    void loadRoles(controller.signal);
    return () => controller.abort();
  }, [loadRoles, loadUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fa");
    if (!query) return users;

    return users.filter((user) =>
      [
        fullName(user),
        user.userName,
        user.nationalCode,
        user.phoneNumber,
        user.roleName,
      ].some((value) => String(value || "").toLocaleLowerCase("fa").includes(query)),
    );
  }, [search, users]);

  const handleAdd = async (newUser) => {
    await createAdminUser(newUser);
    await loadUsers();
    setShowAddModal(false);
  };

  const handleSave = async (updatedUser) => {
    await updateAdminUser(updatedUser);
    await loadUsers();
    setEditUser(null);
  };

  const handleDelete = async () => {
    await deleteAdminUser(deleteUser.id);
    setUsers((current) => current.filter((user) => user.id !== deleteUser.id));
    setDeleteUser(null);
  };

  const handlePasswordChange = async (input) => {
    await changeAdminUserPassword(input);
    setPasswordUser(null);
  };

  const handleToggleStatus = async (user) => {
    setStatusLoadingId(user.id);
    setError("");
    try {
      await changeAdminUserStatus(user);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.message || "تغییر وضعیت کاربر انجام نشد.");
    } finally {
      setStatusLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            مدیریت کاربران
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {users.length} کاربر در سیستم
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex w-fit items-center gap-2 self-start rounded-lg bg-gradient-to-l from-primary to-secondary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          افزودن کاربر
        </button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="جستجو بر اساس نام، کد ملی، نام کاربری یا شماره تماس..."
            className="w-full rounded-lg border border-border/70 bg-card py-2.5 pl-4 pr-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <button
          type="button"
          onClick={() => void loadUsers()}
          disabled={loading}
          aria-label="به‌روزرسانی فهرست"
          title="به‌روزرسانی فهرست"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-card text-muted-foreground hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <button type="button" onClick={() => void loadUsers()} className="font-semibold">
            تلاش مجدد
          </button>
        </div>
      )}

      {loading && users.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center gap-2 rounded-lg border border-border/70 bg-card text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          در حال دریافت کاربران...
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm md:block">
            <div className="responsive-table-shell">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/40">
                    {["نام کاربر", "نام کاربری", "کد ملی", "شماره تماس", "نقش", "وضعیت", "عملیات"].map((header) => (
                      <th key={header} className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {(user.name || user.family || "ک")[0]}
                            </div>
                            <span className="whitespace-nowrap font-medium text-foreground">
                              {fullName(user)}
                            </span>
                          </div>
                        </td>
                        {[user.userName, user.nationalCode, user.phoneNumber].map((value, valueIndex) => (
                          <td key={valueIndex} className="px-4 py-3 font-mono text-xs text-muted-foreground" dir="ltr">
                            {value || "-"}
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleStyle}`}>
                            {user.roleName || "بدون نقش"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${user.isActive ? statusStyles.active : statusStyles.inactive}`}>
                            {user.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {user.isActive ? "فعال" : "غیرفعال"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button type="button" onClick={() => setPasswordUser(user)} aria-label="تغییر رمز عبور" title="تغییر رمز عبور" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-600">
                              <KeyRound className="h-3.5 w-3.5" />
                            </button>
                            <button type="button" disabled={statusLoadingId === user.id} onClick={() => void handleToggleStatus(user)} aria-label={user.isActive ? "غیرفعال کردن کاربر" : "فعال کردن کاربر"} title={user.isActive ? "غیرفعال کردن کاربر" : "فعال کردن کاربر"} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary disabled:opacity-50">
                              {statusLoadingId === user.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Power className="h-3.5 w-3.5" />}
                            </button>
                            <button type="button" onClick={() => setEditUser(user)} aria-label="ویرایش کاربر" title="ویرایش کاربر" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary">
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button type="button" onClick={() => setDeleteUser(user)} aria-label="حذف کاربر" title="حذف کاربر" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onChangePassword={setPasswordUser}
                  onDelete={setDeleteUser}
                  onEdit={setEditUser}
                  onToggleStatus={(selectedUser) => void handleToggleStatus(selectedUser)}
                  statusLoading={statusLoadingId === user.id}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredUsers.length === 0 && (
            <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
              کاربری مطابق جستجوی شما پیدا نشد.
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showAddModal && (
          <AddUserModal
            roles={roles}
            rolesLoading={rolesLoading}
            rolesError={rolesError}
            onReloadRoles={() => void loadRoles()}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAdd}
          />
        )}
        {editUser && (
          <EditUserModal
            user={editUser}
            roles={roles}
            rolesLoading={rolesLoading}
            rolesError={rolesError}
            onReloadRoles={() => void loadRoles()}
            onClose={() => setEditUser(null)}
            onSave={handleSave}
          />
        )}
        {deleteUser && (
          <DeleteConfirmModal user={deleteUser} onClose={() => setDeleteUser(null)} onConfirm={handleDelete} />
        )}
        {passwordUser && (
          <ChangePasswordModal
            user={passwordUser}
            onClose={() => setPasswordUser(null)}
            onSave={handlePasswordChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
