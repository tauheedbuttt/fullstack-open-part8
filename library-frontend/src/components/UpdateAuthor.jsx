import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { EDIT_AUTHOR } from "../services/authors";
import Notify from "./Notify";

// eslint-disable-next-line react/prop-types
const UpdateAuthor = ({ authors }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const [error, setError] = useState(null);

  const [updateAuthor, result] = useMutation(EDIT_AUTHOR);

  const onSubmit = (event) => {
    event.preventDefault();
    console.log("update author...");

    updateAuthor({ variables: { name, setBornTo: Number(born) } });

    setName("");
    setBorn("");
  };

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError("author not found");
    }
  }, [result.data]);

  return (
    <div>
      <Notify errorMessage={error} />
      <h2>Set birthyear</h2>
      <form onSubmit={onSubmit}>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            <option value="" disabled>
              Select author
            </option>
            {
              // eslint-disable-next-line react/prop-types
              authors.map((author) => (
                <option key={author.id} value={author.name}>
                  {author.name}
                </option>
              ))
            }
          </select>
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default UpdateAuthor;
