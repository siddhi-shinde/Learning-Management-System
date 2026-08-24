import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container-fluid py-4">

      <h2 className="fw-bold">
        My Profile
      </h2>

      <div className="card shadow-sm mt-4">

        <div className="card-body">

          <h5>
            {user?.name}
          </h5>

          <p className="text-muted mb-1">
            Email: {user?.email}
          </p>

          <p className="text-muted mb-0">
            Role: {user?.role}
          </p>

        </div>

      </div>

    </div>
  );
};

export default Profile;