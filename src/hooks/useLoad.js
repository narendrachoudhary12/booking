import { useCallback, useEffect, useState } from "react";

// Loads data when the component mounts and whenever deps change.
//   const { data, error, reload } = useLoad(() => getRooms(hotel.id), [hotel.id]);
// data is null while loading; error is the message to show; reload() fetches
// again and keeps the old data on screen meanwhile.
export default function useLoad(load, deps, errorMessage = defaultMessage) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(load, deps);

  const reload = useCallback(
    () =>
      run()
        .then((result) => {
          setData(result);
          setError(null);
        })
        .catch((err) => setError(errorMessage(err))),
    [run, errorMessage]
  );

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);

    run()
      .then((result) => !cancelled && setData(result))
      .catch((err) => !cancelled && setError(errorMessage(err)));

    return () => {
      cancelled = true;
    };
  }, [run, errorMessage]);

  return { data, error, reload, setData };
}

function defaultMessage(error) {
  return error.response?.data?.message || "Something went wrong. Please try again.";
}
