import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";

function List() {
  let ref = useRef(null);
  // const [data, setData] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [updated, setUpdated] = useState({ name: "", description: "" });
  const [inputValue, setInputValue] = useState({
    productName: "",
    description: "",
  });
  const { data, isLoading } = useQuery(
    "products",
    () => {
      return axios
        .get("http://localhost:8080/api/products")
        .then((res) => res.data);
    },
    {
      refetchInterval: 5000,
    }
  );
  // const getData = () => {
  //   axios
  //     .get("http://localhost:8080/api/products")
  //     .then((res) => setData(res.data));
  // };
  // useEffect(() => {
  //   getData();
  // }, []);
  const handleDelete = (item) => {
    console.log(item._id);
    axios.delete("http://localhost:8080/api/products/" + item._id);
    // .then((res) => getData());
  };
  const handleClick = () => {
    console.log(inputValue);
    axios.post("http://localhost:8080/api/products/", inputValue);
    // .then((res) => getData());

    setInputValue({
      productName: "",
      description: "",
    });
  };
  const handleUpdate = () => {
    axios
      .put("http://localhost:8080/api/products/" + updated._id, {
        productName: updated.productName,
        description: updated.description,
      })
      // .then((res) => getData())
      .then((res) => setClicked(false));
  };
  return (
    <div>
      <>
        <div className="inputContainer">
          <input
            value={inputValue.productName}
            onChange={(e) =>
              setInputValue((prevState) => {
                return {
                  ...prevState,
                  productName: e.target.value,
                };
              })
            }
            type={"text"}
            placeholder="name"
          />
          <input
            value={inputValue.description}
            onChange={(e) =>
              setInputValue((prevState) => {
                return {
                  ...prevState,
                  description: e.target.value,
                };
              })
            }
            type={"description"}
            placeholder="description"
          />
          <button className="add" onClick={() => handleClick()}>
            add new
          </button>
        </div>
        <table>
          <thead>
            <th>Product Name</th>
            <th>Description</th>
          </thead>
          <tbody>
            {data &&
              data.map((item, i) => {
                return (
                  <tr>
                    <td> {item.productName}</td>
                    <td> {item.description}</td>
                    <td>
                      <button
                        className="delete"
                        onClick={() => handleDelete(item)}
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      <button
                        className="update"
                        onClick={() => {
                          setClicked(true),
                            setUpdated(item),
                            ref.current?.scrollIntoView({
                              behavior: "smooth",
                            });
                        }}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {clicked ? (
          <div ref={ref} className="updateContainer">
            <input
              value={updated.productName}
              type="text"
              onChange={(e) =>
                setUpdated((prevState) => {
                  return {
                    ...prevState,
                    productName: e.target.value,
                  };
                })
              }
              placeholder="enter new name"
            />
            <input
              value={updated.description}
              onChange={(e) =>
                setUpdated((prevState) => {
                  return {
                    ...prevState,
                    description: e.target.value,
                  };
                })
              }
              type="text"
              placeholder="enter new description"
            />
            <button className="add" onClick={() => handleUpdate()}>
              Send
            </button>
          </div>
        ) : (
          <></>
        )}
      </>
    </div>
  );
}

export default List;
