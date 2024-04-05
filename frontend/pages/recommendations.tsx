import React, { useEffect, useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {
  getUserDataRollup,
  getUserMatchRequests,
  getAllUsers,
  generateRecommendations,
  requestMatch,
  match,
  unmatch,
} from "@/utils/rollupMethods";
import { useUserWallets } from "@dynamic-labs/sdk-react-core";
import {
  MatchRequestType,
  MatchStatus,
  UserDataType,
} from "@/utils/rollupMethods";
import { getUserData } from "@/firebase";

const Recommendations = () => {
  const userWallets = useUserWallets();
  const userAddress = userWallets[0]?.address;
  const [recommendedProfiles, setRecommendedProfiles] = useState<string[]>([]);
  const [recommendedProfilesData, setRecommendedProfilesData] = useState<any[]>(
    []
  );
  const [userMatchData, setUserMatchData] = useState<any>([]);
  const [matchRequests, setMatchRequests] = useState<MatchRequestType[]>([]);
  const [matchRequestsData, setMatchRequestsData] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<UserDataType[]>([]);
  const [allUsersData, setAllUsersData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(userAddress);
      try {
        const userData = await getUserDataRollup(userAddress);
        console.log(userData);
        if (userData && userData.currentMatch) {
          const usermatchdata = await getUserData(userData.currentMatch);
          setUserMatchData(usermatchdata);
        }
        const userMatchRequests = await getUserMatchRequests(userAddress);
        const allUsersData = await getAllUsers();
        if (userData) {
          const recommendedProfilesforUser = userData?.recommendations;
          setRecommendedProfiles(recommendedProfilesforUser);
          const profilesData = await Promise.all(
            recommendedProfilesforUser.map((address) => getUserData(address))
          );
          setRecommendedProfilesData(profilesData);
        }
        if (userMatchRequests) {
          setMatchRequests(userMatchRequests);
          const matchRequestsData = await Promise.all(
            userMatchRequests.map(async (request) => {
              const user1Data = await getUserData(request.user1);
              return user1Data;
            })
          );
          console.log(matchRequestsData);
          setMatchRequestsData(matchRequestsData);
        }
        if (allUsersData) {
          const filteredUsers = allUsersData.filter(
            (user) =>
              user.currentMatch ==
                "0x0000000000000000000000000000000000000000" &&
              user.address !== userAddress
          );
          setAllUsers(filteredUsers);
          const usersData = await Promise.all(
            filteredUsers.map(async (user) => {
              const userData = await getUserData(user.address);
              return userData;
            })
          );

          console.log(usersData);
          setAllUsersData(usersData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (userAddress) {
      fetchData();
    }
  }, [userAddress]);

  const refreshFeed = async () => {
    const newRecommendedProfilesData = await generateRecommendations(
      userAddress
    );
    if (newRecommendedProfilesData) {
      setRecommendedProfiles(newRecommendedProfilesData);
    }
  };

  const handleRequestMatch = async (otherAddress: string) => {
    const requestData = {
      userAddress: userAddress,
      otherAddress: otherAddress,
    };
    const request = await requestMatch(requestData);
    console.log(request);
    if (recommendedProfiles.includes(otherAddress)) {
      setRecommendedProfiles((prevProfiles) =>
        prevProfiles.filter((address) => address !== otherAddress)
      );
    }
  };

  const handleRejectRecommended = async (otherAddress: string) => {
    if (recommendedProfiles.includes(otherAddress)) {
      setRecommendedProfiles((prevProfiles) =>
        prevProfiles.filter((address) => address !== otherAddress)
      );
    }
  };

  const handleMatch = async (otherAddress: string) => {
    const requestData = {
      userAddress: userAddress,
      otherAddress: otherAddress,
    };
    const matchreq = await match(requestData);
    console.log(matchreq);
  };

  const handleUnMatch = async (otherAddress: string) => {
    const requestData = {
      userAddress: userAddress,
      otherAddress: otherAddress,
    };
    const unmatchreq = await unmatch(requestData);
    console.log(unmatchreq);
  };

  return (
    <div className="w-screen h-full flex">
      <Tabs isFitted variant="enclosed" className="w-screen">
        <TabList mb="1em">
          <Tab>Recommendations</Tab>
          <Tab>Request</Tab>
          <Tab>Matches</Tab>
          <button
            onClick={() => refreshFeed()}
            className="bg-blue-500 text-white px-10 py-2 rounded-xl mx-2 my-2"
          >
            Refresh
          </button>
        </TabList>
        <TabPanels>
          <TabPanel>
            <h2>Recommended Addresses</h2>
            {/* {recommendedProfilesData.length > 0 &&
            recommendedProfiles.length > 0 ? (
              <ul>
                {recommendedProfilesData.map((userData, index) => (
                  <li key={index}>
                    <p>from recommended</p>
                    <p>Name: {userData?.name}</p>
                    <p>Age: {userData?.age}</p>
                    <img src={userData?.image} alt="user image"></img>
                    <button
                      onClick={() => handleRequestMatch(userData?.address)}
                      className="bg-blue-500 text-white rounded-xl"
                    >
                      💜
                    </button>
                    <button
                      onClick={() => handleRejectRecommended(userData?.address)}
                      className="bg-red-500 text-white rounded-xl"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            ) : ( */}
            <div>
              <div>
                {recommendedProfilesData.length > 0 &&
                  recommendedProfiles.length > 0 && (
                    <ul>
                      {recommendedProfilesData.map((userData, index) => (
                        <li key={index}>
                          <p>from recommended</p>
                          <p>Name: {userData?.name}</p>
                          <p>Age: {userData?.age}</p>
                          <img src={userData?.image} alt="user image"></img>
                          <button
                            onClick={() =>
                              handleRequestMatch(userData?.address)
                            }
                            className="bg-blue-500 text-white rounded-xl"
                          >
                            💜
                          </button>
                          <button
                            onClick={() =>
                              handleRejectRecommended(userData?.address)
                            }
                            className="bg-red-500 text-white rounded-xl"
                          >
                            ❌
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
              <div>
                {allUsers.length > 0 && allUsersData.length > 0 && (
                  <div>
                    <ul>
                      {allUsersData.map((userData, index) => (
                        <li key={index}>
                          <p>from all users</p>
                          <p>name : {userData?.name}</p>
                          <p>Age: {userData?.age}</p>
                          <img src={userData?.image} alt="user image"></img>
                          <button
                            onClick={() =>
                              handleRequestMatch(userData?.address)
                            }
                            className="bg-blue-500 text-white rounded-xl"
                          >
                            💜
                          </button>
                          <button className="bg-red-500 text-white rounded-xl">
                            ❌
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {/* )} */}
          </TabPanel>
          <TabPanel>
            {matchRequests.length > 0 && matchRequestsData.length > 0 ? (
              <div>
                <h2>Match Requests</h2>
                <ul>
                  {matchRequests
                    .filter(
                      (request) => request.status === MatchStatus.REQUESTED
                    )
                    .map((request, index) => (
                      <li key={index}>
                        {matchRequestsData[index] && (
                          <>
                            <p>Name: {matchRequestsData[index].name}</p>
                            <p>Age: {matchRequestsData[index].age}</p>
                            <button
                              onClick={() =>
                                handleMatch(matchRequestsData[index].address)
                              }
                              className="bg-blue-500 text-white rounded-xl"
                            >
                              💜
                            </button>
                            <button className="bg-red-500 text-white rounded-xl">
                              ❌
                            </button>
                          </>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <p>No match Request Found</p>
            )}
          </TabPanel>
          <TabPanel>
            <div>
              <h2>Matches</h2>
              {userMatchData ? (
                <>
                  <p>Name: {userMatchData?.name}</p>
                  <p>Age: {userMatchData?.age}</p>
                  <button onClick={() => handleUnMatch(userMatchData?.address)}>
                    unmatch
                  </button>
                </>
              ) : (
                <div>
                  <p>No matches yet</p>
                </div>
              )}
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Recommendations;
