import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2,
  Edit3,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { AddUserModal, DeleteConfirmModal, EditUserModal } from "./AdminModals";
import { mockUsers, userStatusStyle } from "./adminData";

function UserCard({ user, onDelete, onEdit }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-3 rounded-2xl border border-border/60 bg-card p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-sm font-bold text-primary">
            {user.name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{user.name}</p>
            <p className="font-mono text-xs text-muted-foreground" dir="ltr">
              {user.phone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(user)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${userStatusStyle[user.role] || "bg-muted text-muted-foreground border-border"}`}
        >
          {user.role}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${userStatusStyle[user.status]}`}
        >
          {user.status === "فعال" ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {user.status}
        </span>
        <span className="mr-auto text-xs text-muted-foreground">
          {user.joined}
        </span>
      </div>
    </motion.div>
  );
}

export function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.includes(search) ||
      user.username.includes(search) ||
      user.phone.includes(search),
  );

  const handleAdd = (newUser) => {
    setUsers((previousUsers) => [newUser, ...previousUsers]);
    setShowAddModal(false);
  };

  const handleSave = (updatedUser) => {
    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      ),
    );
    setEditUser(null);
  };

  const handleDelete = () => {
    setUsers((previousUsers) =>
      previousUsers.filter((user) => user.id !== deleteUser.id),
    );
    setDeleteUser(null);
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
          onClick={() => setShowAddModal(true)}
          className="inline-flex w-fit items-center gap-2 self-start rounded-xl bg-gradient-to-l from-primary to-secondary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          افزودن کاربر
        </button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="جستجو بر اساس نام، کد ملی یا شماره..."
          className="w-full rounded-xl border border-border/70 bg-card py-2.5 pl-4 pr-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/70 bg-muted/40">
                {[
                  "نام کاربر",
                  "نام کاربری",
                  "شماره تماس",
                  "نقش",
                  "وضعیت",
                  "تاریخ ثبت‌نام",
                  "عملیات",
                ].map((header) => (
                  <th
                    key={header}
                    className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold text-muted-foreground"
                  >
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
                    transition={{ delay: index * 0.04 }}
                    className="border-b border-border/40 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-xs font-bold text-primary">
                          {user.name[0]}
                        </div>
                        <span className="whitespace-nowrap font-medium text-foreground">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-4 py-3 font-mono text-xs text-muted-foreground"
                      dir="ltr"
                    >
                      {user.username}
                    </td>
                    <td
                      className="px-4 py-3 font-mono text-xs text-muted-foreground"
                      dir="ltr"
                    >
                      {user.phone}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${userStatusStyle[user.role] || "bg-muted text-muted-foreground border-border"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${userStatusStyle[user.status]}`}
                      >
                        {user.status === "فعال" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {user.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                      {user.joined}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditUser(user)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteUser(user)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
                        >
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
              onDelete={setDeleteUser}
              onEdit={setEditUser}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAdd}
          />
        )}
        {editUser && (
          <EditUserModal
            user={editUser}
            onClose={() => setEditUser(null)}
            onSave={handleSave}
          />
        )}
        {deleteUser && (
          <DeleteConfirmModal
            user={deleteUser}
            onClose={() => setDeleteUser(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
