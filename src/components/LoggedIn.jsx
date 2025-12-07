import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import facade from "../apiFacade";

function LoggedIn() {
  const [dataFromServer, setDataFromServer] = useState("Loading...");
  const { loggedIn } = useOutletContext();

  useEffect(() => {
    if (loggedIn) {
      facade
        .fetchData()
        .then((data) => setDataFromServer(JSON.stringify(data, null, 2)))
        .catch((err) => {
          dataFromServer("Error fetching data");
          console.error(err);
        });
    }
  }, [loggedIn]);
}
export default LoggedIn;
