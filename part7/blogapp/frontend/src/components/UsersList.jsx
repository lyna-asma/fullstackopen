import { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import useUserListStore from "../stores/userListStore";
import useUserStore from "../stores/userStore";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 1em;

  thead {
    background: #34495e;
  }

  th {
    background: #34495e;
    color: white;
    text-align: left;
    padding: 0.75em 1em;
    font-weight: 500;
  }

  td {
    padding: 0.75em 1em;
    border-bottom: 1px solid #e1e2e6;
    color: #2c3e50;
  }

  tbody tr:nth-child(even) {
    background-color: #f8f9fa;
  }

  tbody tr:hover {
    background-color: #edf2f7;
  }

  a {
    color: #34495e;
    font-weight: 600;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;
const AvatarSmall = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 0.5em;
`;

const CurrentUserText = styled.span`
  color: #7f8c8 ;
  font-weight: 400;
`;

const UsersList = () => {
  const users = useUserListStore((state) => state.users);
  const fetchUsers = useUserListStore((state) => state.fetchUsers);
  const loggedInUser = useUserStore((state) => state.user);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <h2>Users</h2>
      <Table>
        <thead>
          <tr>
            <th>name</th>
            <th>username</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isCurrentUser =
              loggedInUser &&
              (loggedInUser.username === user.username ||
                loggedInUser.id === user.id);

            return (
              <tr key={user.id}>
                <td>
                  <AvatarSmall
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.username}`}
                    alt={user.name}
                  />
                  <Link to={`/users/${user.id}`}>
                    {isCurrentUser ? (
                      <CurrentUserText>You</CurrentUserText>
                    ) : (
                      user.name
                    )}
                  </Link>
                </td>
                <td>{user.username}</td>
                <td>{user.blogs ? user.blogs.length : 0}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default UsersList;
