import { createContext, useContext, useMemo, useState } from 'react'
import { seedUsers } from '../pages/users/usersData'

const UsersContext = createContext({
  users: [],
  getUser: () => null,
  addUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
})

export function UsersProvider({ children }) {
  const [users, setUsers] = useState(seedUsers)

  const value = useMemo(
    () => ({
      users,
      getUser: (id) => users.find((u) => u.id === id) ?? null,
      addUser: (user) => {
        const id = String(Date.now())
        setUsers((prev) => [{ ...user, id }, ...prev])
        return id
      },
      updateUser: (id, patch) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))
      },
      deleteUser: (id) => {
        setUsers((prev) => prev.filter((u) => u.id !== id))
      },
    }),
    [users],
  )

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
}

export function useUsers() {
  return useContext(UsersContext)
}
