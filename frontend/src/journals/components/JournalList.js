import React from "react";

import Card from "../../shared/components/UIElements/Card";
import EntryItem from "./EntryItem"; // UPDATED import
import Button from "../../shared/components/FormElements/Button";
import "./JournalList.css"; // Keeping CSS name for now or rename to JournalList.css

const JournalList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No journal entries found. Maybe create one?</h2>
          <Button to="/journal/new">Share Entry</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((entry) => (
        <EntryItem
          key={entry.id}
          id={entry.id}
          // UPDATED: Mapping new backend fields
          photo={entry.photo}
          headline={entry.headline}
          journalText={entry.journalText}
          locationName={entry.locationName}
          creatorId={entry.author}
          coordinates={entry.coordinates}
          onDelete={props.onDeleteEntry}
        />
      ))}
    </ul>
  );
};

export default JournalList;