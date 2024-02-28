import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Container from "@mui/material/Container";
import { Header } from "./components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchPost } from "./redux/slices/posts";
import { fetchAuth, selectIsAuth } from "./redux/slices/auth";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    dispatch(fetchAuth());
    dispatch(fetchPost());
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Container maxWidth="lg">
        <AppRouter />
      </Container>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
