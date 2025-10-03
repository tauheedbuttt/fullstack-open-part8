import { useQuery } from "@apollo/client";
import { ME } from "../services/auth";

const useUser = () => {
  const { data, loading, error } = useQuery(ME);

  const favoriteGenre = data?.me?.favoriteGenre;

  return { data, loading, error, favoriteGenre };
};

export default useUser;
