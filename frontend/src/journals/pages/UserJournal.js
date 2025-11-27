import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import JournalList from "../components/JournalList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserJournal = () => {
  const [loadedEntries, setLoadedEntries] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5005/api/journal/user/${userId}`
        );
        setLoadedEntries(responseData.entries);
      } catch (err) {}
    };
    fetchEntries();
  }, [sendRequest, userId]);

  const entryDeletedHandler = (deletedEntryId) => {
    setLoadedEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.id !== deletedEntryId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedEntries && (
        <JournalList items={loadedEntries} onDeleteEntry={entryDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserJournal;