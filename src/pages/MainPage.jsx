import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import NavigationComponent from "../components/NavigationComponent";
import WithLoadingComponent from "../components/WithLoadingComponent";
import DashboardComponent from "../components/DashboardComponent";
import FooterComponent from "../components/FooterComponent";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
const DashboardWithLoading = WithLoadingComponent(DashboardComponent);

export default function MyPage() {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (e, data) => {
    e.preventDefault();
    setUserData(data);
    setOpen(true);
  };

  const GET_USERS = gql`
    query {
      users {
        id
        name
        timestamp
      }
    }
  `;

  const POST_USER = gql`
    mutation AddUser($name: String!) {
      insert_users(objects: { name: $name }) {
        returning {
          id
          name
        }
      }
    }
  `;

  const UPDATE_USER = gql`
    mutation UpdateUser($id: uuid!, $name: String!) {
      update_users(where: { id: { _eq: $id } }, _set: { name: $name }) {
        returning {
          id
          name
          timestamp
        }
      }
    }
  `;

  const DELETE_USER = gql`
    mutation DeleteUser($id: uuid!) {
      delete_users(where: { id: { _eq: $id } }) {
        affected_rows
      }
    }
  `;

  const [deleteUser, { loading: deleting, error: deleteError }] = useMutation(
    DELETE_USER,
    {
      refetchQueries: [GET_USERS],
    }
  );
  function GetData() {
    const { loading, error, data } = useQuery(GET_USERS);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    if (deleting) return "Deleting...";
    if (deleteError) return `Deletion error! ${deleteError.message}`;

    const DeleteData = (e, id) => {
      if (deleting) return;
      console.log(id);
      deleteUser({ variables: { id: id } });
    };
    return (
      <div className="container my-4">
        <div className="row justify-content-center py-3">
          <div className="card card-body shadow rounded-lg p-5 border-0">
            <table className="table table-hover table-borderless mb-0">
              <thead className="thead-light">
                <tr>
                  <th>Name</th>
                  <th>Id</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((data, index) => {
                  return (
                    <tr className="table-row-border" key={index}>
                      <th>{data.name}</th>
                      <td>{data.id}</td>
                      <td>{data.timestamp}</td>
                      <td>
                        <div className="action-button-wrapper">
                          <a
                            className="action-button"
                            onClick={(e) => handleClickOpen(e, data)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-primary"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </a>
                        </div>
                        <div className="action-button-wrapper ml-2">
                          <a
                            className="action-button"
                            onClick={(e) => DeleteData(e, data.id)}
                            disabled={deleting}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-danger"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function PostData() {
    let input;
    const [addUser, { data, loading, error }] = useMutation(POST_USER, {
      refetchQueries: [GET_USERS],
    });

    if (loading) return "Submitting...";
    if (error) return `Submission error! ${error.message}`;

    return (
      <div className="container mt-5">
        <div className="row justify-content-center pt-3">
          <div className="col-sm-10">
            <form
              className="w-100"
              onSubmit={(e) => {
                e.preventDefault();
                addUser({ variables: { name: input.value } });
                input.value = "";
              }}
            >
              <div class="form-row">
                <div class="form-group col-md-3">
                  <label className="lead font-weight-normal" for="name">
                    Add new user (mutation)
                  </label>
                </div>
                <div class="form-group col-md-6">
                  <input
                    placeholder="Enter name of the user"
                    className="form-control"
                    required
                    id="name"
                    ref={(node) => {
                      input = node;
                    }}
                  />
                </div>
                <div class="form-group col-md-3">
                  <button
                    className="btn btn-danger btn-block shadow rounded-lg px-5"
                    type="submit"
                  >
                    Add User
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  function UpdateData(props) {
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    React.useEffect(() => {
      if (props.userData) {
        setUserId(props.userData.id);
        setUserName(props.userData.name);
      }
    }, [props.userData]);

    const [updateUser, { data, loading, error }] = useMutation(UPDATE_USER, {
      refetchQueries: [GET_USERS],
    });

    if (loading) return "Submitting...";
    if (error) return `Submission error! ${error.message}`;

    const handleInputName = (event) => {
      setUserName(event.target.value);
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(userId);
      console.log(userName);
      updateUser({ variables: { id: userId, name: userName } });
      setOpen(false);
    };
    const handleClose = () => {
      setOpen(false);
    };

    return (
      <div>
        <Dialog
          open={props.open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Update</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To update, please enter your name here. We will process your
              update as soon as possible.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="nameUpdate"
              label="Name"
              type="text"
              value={userName}
              onChange={handleInputName}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={(e) => handleSubmit(e)} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  return (
    <React.Fragment>
      {/* <MyContext.Provider value={data}> */}
      <NavigationComponent />
      <PostData />
      <GetData />
      <UpdateData open={open} userData={userData} />
      {/* <DashboardWithLoading isLoading={isLoading} /> */}
      <FooterComponent />
      {/* </MyContext.Provider> */}
    </React.Fragment>
  );
}
