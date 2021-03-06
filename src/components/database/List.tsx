import React, { FC, useState } from "react";
import {
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  Query,
  query,
  where,
} from "firebase/firestore";

import DisplayMember from "./DisplayMember";

let List: FC<dbProps> = ({ teams, userID }) => {
  let teamMembers: teamMember[];
  let setTeamMembers: any;
  [teamMembers, setTeamMembers] = useState([]);

  let q: Query<DocumentData> = query(teams, where("uid", "==", userID));

  let unsub = onSnapshot(q, (teamMembers) => {
    const members: teamMember[] = [];

    teamMembers.forEach((member) => {
      let deletor = async () => {
        await deleteDoc(doc(teams, member.id));
      };
      let data = member.data();
      let temp: teamMember = {
        name: data.member_name,
        location: [data.lat, data.long],
        country:
          data.country[0]?.toUpperCase() +
          data.country.slice(1).replace(/-/g, " "),
        del: deletor,
      };

      members.push(temp);
    });

    setTeamMembers(members);
  });

  return (
    <div className="teamsListWrapper">
      <h2 className="manageTitle">Current team members</h2>
      <div className="teamsListFlex">
        <div className="teamMember teamMemberHeading">
          <span>Name</span>
          <span>Lat / Long</span>
          <span>Country</span>
          <div className="delete"></div>
        </div>
        {teamMembers.map((e) => (
          <DisplayMember member={e} />
        ))}
      </div>
    </div>
  );
};

export default List;
