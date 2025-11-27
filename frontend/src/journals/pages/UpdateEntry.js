import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";

const UpdateEntry = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedEntry, setLoadedEntry] = useState();
  const entryId = useParams().entryId; // Assumes route is /journal/:entryId
  const navigate = useNavigate();
  


  const [formState, inputHandler, setFormData] = useForm(
    {
      headline: {
        value: "",
        isValid: false,
      },
      journalText: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5005/api/journal/${entryId}`
        );
        setLoadedEntry(responseData.entry);
        setFormData(
          {
            headline: {
              value: responseData.entry.headline,
              isValid: true,
            },
            journalText: {
              value: responseData.entry.journalText,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchEntry();
  }, [sendRequest, entryId, setFormData]);

  const entryUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("Submitting update…", entryId);   // log 1
    console.log("Update request payload:", {
      headline: formState.inputs.headline.value,
      journalText: formState.inputs.journalText.value,
    });   // log 2

    try {
      const responseData = await sendRequest(
        `http://localhost:5005/api/journal/${entryId}`,
        "PATCH",
        JSON.stringify({
          headline: formState.inputs.headline.value,
          journalText: formState.inputs.journalText.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      console.log("Response received:", responseData);  // log 3
      console.log("setIsLoading should be triggered here");  // log 4

      navigate("/" + auth.userId + "/journal");
      console.log("Navigating to journal list");   // log 5
    } catch (err) {
      console.error("Update error:", err);   // log 6
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedEntry && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find entry!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedEntry && (
        <form className="place-form" onSubmit={entryUpdateSubmitHandler}>
          <Input
            id="headline"
            element="input"
            type="text"
            label="Headline"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid headline."
            onInput={inputHandler}
            initialValue={loadedEntry.headline}
            initialValid={true}
          />
          <Input
            id="journalText"
            element="textarea"
            label="Journal Text"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter valid text (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedEntry.journalText}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE ENTRY
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateEntry;