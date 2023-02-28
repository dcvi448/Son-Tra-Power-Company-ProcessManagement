import { useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../components/firebase.js";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-profile.jpeg";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [branch, setBranch] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null);
  const [isLoginClicked, setIsLoginClicked] = useState(null);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    const user = e.target[0].value;
    const password = e.target[2].value;
    const q = query(collection(db, "Auth"), where("user", "==", user));
    debugger;
    const querySnapshot = await getDocs(q);
    let docids = [];
    let data = [];

    querySnapshot.forEach((doc) => {
      docids = [...docids, doc.id];
      data = [...data, doc.data()];
    });
    if (docids.length > 0) {
      setUser(data[0].user);
      setRole(data[0].role);
      setBranch(data[0].branch);
      setIsSuccess(true);
    } else {
      setUser(null);
      setRole(null);
      setBranch(null);
      setIsSuccess(false);
    }

    setIsLoginClicked(Math.random());
  };
  useEffect(() => {
    if (isLoginClicked) {
      if (isSuccess && user && role) {
        toast.success("Đăng nhập thành công", {
          autoClose: 3000,
          closeOnClick: true,
          position: "bottom-right",
        });
      } else {
        toast.error("Đăng nhập thất bại", {
          autoClose: 3000,
          closeOnClick: true,
          position: "bottom-right",
        });
      }
    }
  }, [isLoginClicked]);

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Đăng nhập
          </MDTypography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ mt: 1, mb: 1 }}
          ></Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={HandleSubmit}>
            <MDBox mb={2}>
              <MDInput type="text" label="Tên đăng nhập" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Mật khẩu" fullWidth />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Nhớ mật khẩu
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Đăng nhập
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      <ToastContainer position="bottom-right" limit={1} />
    </BasicLayout>
  );
}

export default Basic;
