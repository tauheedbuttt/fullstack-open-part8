import { useQuery, useSubscription } from "@apollo/client";
import { useState } from "react";
import { ALL_BOOKS, BOOK_ADDED } from "../services/books";

const Books = (props) => {
  const [genre, setGenre] = useState();
  const variables = (genre) => ({
    // eslint-disable-next-line react/prop-types
    genre: genre || props.favoriteGenre || null,
  });

  const result = useQuery(ALL_BOOKS, {
    // eslint-disable-next-line react/prop-types
    variables: variables(genre),
  });

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const bookAdded = data.data.bookAdded;
      client.cache.updateQuery(
        { query: ALL_BOOKS, variables: variables(genre) },
        (data) => {
          alert(
            `New book added: ${bookAdded.title} by ${bookAdded.author.name}`
          );
          return {
            allBooks: [...data.allBooks, bookAdded],
          };
        }
      );
    },
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
