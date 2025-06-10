import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    const user = {
      fullName: localStorage.getItem("full_name"),
      phoneNumber: localStorage.getItem("phone_number"),
      address: localStorage.getItem("address"),
      dateOfBirth: localStorage.getItem("date_of_birth"),
      email: localStorage.getItem("email"),
    };
    setUserData(user);
  }, []);

  const totalSpent = userData.purchaseHistory?.reduce((acc: number, order: any) => acc + order.totalAmount, 0);

  return (
    <div className="user-profile">
      <h2>Thông tin khách hàng</h2>
      {userData.profilePicture && <img src={userData.profilePicture} alt="Profile" className="profile-picture" />}
      <p><strong>Họ và tên:</strong> {userData.fullName}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Số điện thoại:</strong> {userData.phoneNumber}</p>
      <p><strong>Địa chỉ:</strong> {userData.address}</p>
      <p><strong>Ngày sinh:</strong> {userData.dateOfBirth}</p>

    </div>
  );
}

export default UserProfile;
