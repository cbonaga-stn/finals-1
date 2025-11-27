import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";

const NewEntry = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  
  const [formState, inputHandler] = useForm(
    {
      headline: {
        value: "",
        isValid: false,
      },
      journalText: {
        value: "",
        isValid: false,
      },
      locationName: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const navigate = useNavigate();

  const entrySubmitHandler = async (event) => {
    try {      
      sendRequest(
        "http://localhost:5005/api/journal",
        "POST",
        JSON.stringify({
          headline: formState.inputs.headline.value,
          journalText: formState.inputs.journalText.value,
          locationName: formState.inputs.locationName.value,
          author: auth.userId,
        }),
        { "Content-Type": "application/json" }
      );
      
      navigate("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={entrySubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="headline"
          element="input"
          type="text"
          label="Headline"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid headline."
          onInput={inputHandler}
        />
        <Input
          id="journalText"
          element="textarea"
          label="Journal Text"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter valid text (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="locationName"
          element="input"
          label="Location"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid location."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD ENTRY
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewEntry;