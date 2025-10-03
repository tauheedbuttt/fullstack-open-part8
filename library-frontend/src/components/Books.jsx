import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../services/books";
import { useState } from "react";

const Books = (props) => {
  const [genre, setGenre] = useState();
  // eslint-disable-next-line react/prop-types
  const variables = (genre) => ({
    genre: genre || props.favoriteGenre || null,
  });

  const result = useQuery(ALL_BOOKS, {
    // eslint-disable-next-line react/prop-types
    variables: variables(genre),
  });

  // eslint-disable-next-line react/prop-types
  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;
  const genres = [...new Set(books.map((b) => b.genres).flat())];
  const filtered = books;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filtered.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {
        // eslint-disable-next-line react/prop-types
        !props.favoriteGenre && (
          <div>
            {genres.map((item) => (
              <button
                onClick={() => {
                  setGenre(item === genre ? null : item);
                  result.refetch(variables(item === genre ? null : item));
                }}
                key={item}
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => {
                setGenre(null);
                result.refetch(variables(null));
              }}
            >
              all genres
            </button>
          </div>
        )
      }
    </div>
  );
};

export default Books;
