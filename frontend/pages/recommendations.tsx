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
import nomatches from "../public/nomatches.png";
import norequests from "../public/norequests.png";
import Image from "next/image";

const Recommendations = () => {
  const userWallets = useUserWallets();
  const userAddress = userWallets[0]?.address;
  const [recommendedProfiles, setRecommendedProfiles] = useState<string[]>([]);
  const [recommendedProfilesData, setRecommendedProfilesData] = useState<any[]>(
    []
  );
  const [userMatchData, setUserMatchData] = useState<any>();
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
        if (userData && userMatchRequests) {
          const recommendedProfilesforUser = userData?.recommendations;
          const filteredRecommendation = recommendedProfilesforUser.filter(
            (recommendedProfile) => {
              const isValid = userMatchRequests.find((matchRequest) => {
                return matchRequest.user2 == recommendedProfile;
              });

              return isValid == undefined ? true : false;
            }
          );
          setRecommendedProfiles(filteredRecommendation);
          const profilesData = await Promise.all(
            filteredRecommendation.map((address) => getUserData(address))
          );
          setRecommendedProfilesData(profilesData);
        }
        if (userMatchRequests) {
          setMatchRequests(userMatchRequests);
          const filteredMatchRequests = userMatchRequests.filter(
            (matchRequests) => matchRequests.user2 == userAddress
          );
          const matchRequestsData = await Promise.all(
            filteredMatchRequests.map(async (request) => {
              const user1Data = await getUserData(request.user1);
              return user1Data;
            })
          );
          console.log(matchRequestsData);
          setMatchRequestsData(matchRequestsData);
        }
        if (allUsersData && userData && userMatchRequests) {
          // TODO :  Filter the all user data , and only show the profile which atleast match the bare min 4 factors
          // TODO : Also remove the profile if it is in match Request or already matched or in recommendation

          const filteredUsers = allUsersData
            .filter(
              (user) =>
                user.currentMatch ==
                  "0x0000000000000000000000000000000000000000" &&
                user.address !== userAddress &&
                userData.preferences[2] == user.extras[2]
            )
            .filter((user) => {
              const isValid = userData.recommendations.find(
                (recommendation) => {
                  return recommendation == user.address;
                }
              );
              console.log(isValid);

              return isValid == undefined ? true : false;
            })
            .filter((user) => {
              const isValid = userData.currentMatch != user.address;
              console.log(isValid);

              return isValid;
            })
            .filter((user) => {
              const isValid = userMatchRequests.find((matchRequest) => {
                return (
                  matchRequest.user2 == user.address ||
                  matchRequest.user1 == user.address
                );
              });
              console.log(isValid);

              return isValid == undefined ? true : false;
            });

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
    <div className="w-screen h-full flex mt-3">
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
            {recommendedProfilesData.length > 0 &&
              recommendedProfiles.length > 0 && (
                <div className="flex flex-col justify-center mx-auto">
                  <ul className="flex flex-col justify-center mx-auto">
                    {recommendedProfilesData.map((userData, index) => (
                      <li
                        className={`border border-gray-400 mt-10 flex flex-col shadow-lg rounded-xl w-[500px] h-[760px]`}
                        key={index}
                      >
                        <img
                          src={userData?.image}
                          alt="user image"
                          className={`w-full h-[450px] items-center mx-auto rounded-xl flex justify-center`}
                        ></img>
                        <div className="px-5 py-5 grid grid-flow-col grid-rows-4 grid-cols-2 gap-x-2 gap-y-2">
                          <div className="flex flex-col justify-start">
                            <p className="text-gray-600 text-sm">Name</p>
                            <p className="text-lg text-black">
                              {userData?.name}
                            </p>
                          </div>
                          <div className="flex flex-col justify-start">
                            <p className="text-gray-600 text-sm">Age</p>
                            <p className="text-lg text-black">
                              {userData?.age}
                            </p>
                          </div>
                          <div className="flex flex-col justify-start">
                            <p className="text-gray-600 text-sm">Gender</p>
                            <p className="text-lg text-black">
                              {userData?.gender}
                            </p>
                          </div>
                          <div className="flex flex-col justify-start">
                            <p className="text-gray-600 text-sm">Ethinicty</p>
                            <p className="text-lg text-black">
                              {userData?.ethnicity}
                            </p>
                          </div>
                          <div className="flex flex-col justify-start">
                            <p className="text-gray-600 text-sm">Zodiac</p>
                            <p className="text-lg text-black">
                              {userData?.zodiac}
                            </p>
                          </div>
                          <div className="flex flex-col justify-start">
                            <p className="text-gray-600 text-sm">
                              Type of Dating prefered
                            </p>
                            <p className="text-lg text-black">
                              {userData?.tod}
                            </p>
                          </div>
                          <div className="flex flex-col justify-start">
                            <p className="text-gray-600 text-sm">
                              Favourite Sport
                            </p>
                            <p className="text-lg text-black">
                              {userData?.preferences.Sports}
                            </p>
                          </div>
                          <div className="flex flex-col justify-start">
                            <p className="text-gray-600 text-sm">
                              Likes Travelling
                            </p>
                            <p className="text-lg text-black">
                              {userData?.preferences.Travelling}
                            </p>
                          </div>
                        </div>
                        <div className="flex w-full justify-evenly">
                          <button
                            onClick={() =>
                              handleRequestMatch(userData?.address)
                            }
                            className="bg-blue-500 text-white rounded-xl w-1/2 px-2 py-2 mx-2"
                          >
                            💜
                          </button>
                          <button
                            onClick={() =>
                              handleRejectRecommended(userData?.address)
                            }
                            className="bg-red-500 text-white rounded-xl w-1/2 px-2 py-2 mx-2"
                          >
                            ❌
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            <div>
              <div>
                {allUsers.length > 0 && allUsersData.length > 0 && (
                  <div className="flex flex-col justify-center mx-auto">
                    <ul className="flex flex-col justify-center mx-auto">
                      {allUsersData.map((userData, index) => (
                        <li
                          className={`border border-gray-400 mt-10 flex flex-col shadow-lg rounded-xl w-[500px] h-[760px]`}
                          key={index}
                        >
                          <img
                            src={userData?.image}
                            alt="user image"
                            className={`w-full h-[450px] items-center mx-auto rounded-xl flex justify-center`}
                          ></img>
                          <div className="px-5 py-5 grid grid-flow-col grid-rows-4 grid-cols-2 gap-x-2 gap-y-2">
                            <div className="flex flex-col justify-start">
                              <p className="text-gray-600 text-sm">Name</p>
                              <p className="text-lg text-black">
                                {userData?.name}
                              </p>
                            </div>
                            <div className="flex flex-col justify-start">
                              <p className="text-gray-600 text-sm">Age</p>
                              <p className="text-lg text-black">
                                {userData?.age}
                              </p>
                            </div>
                            <div className="flex flex-col justify-start">
                              <p className="text-gray-600 text-sm">Gender</p>
                              <p className="text-lg text-black">
                                {userData?.gender}
                              </p>
                            </div>
                            <div className="flex flex-col justify-start">
                              <p className="text-gray-600 text-sm">Ethinicty</p>
                              <p className="text-lg text-black">
                                {userData?.ethnicity}
                              </p>
                            </div>
                            <div className="flex flex-col justify-start">
                              <p className="text-gray-600 text-sm">Zodiac</p>
                              <p className="text-lg text-black">
                                {userData?.zodiac}
                              </p>
                            </div>
                            <div className="flex flex-col justify-start">
                              <p className="text-gray-600 text-sm">
                                Type of Dating prefered
                              </p>
                              <p className="text-lg text-black">
                                {userData?.tod}
                              </p>
                            </div>
                            <div className="flex flex-col justify-start">
                              <p className="text-gray-600 text-sm">
                                Favourite Sport
                              </p>
                              <p className="text-lg text-black">
                                {userData?.preferences.Sports}
                              </p>
                            </div>
                            <div className="flex flex-col justify-start">
                              <p className="text-gray-600 text-sm">
                                Likes Travelling
                              </p>
                              <p className="text-lg text-black">
                                {userData?.preferences.Travelling}
                              </p>
                            </div>
                          </div>
                          <div className="flex w-full justify-evenly">
                            <button
                              onClick={() =>
                                handleRequestMatch(userData?.address)
                              }
                              className="bg-blue-500 text-white rounded-xl w-1/2 px-2 py-2 mx-2"
                            >
                              💜
                            </button>
                            <button className="bg-red-500 text-white rounded-xl w-1/2 px-2 py-2 mx-2">
                              ❌
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            {matchRequests.length > 0 && matchRequestsData.length > 0 ? (
              <div className="flex flex-col justify-center mx-auto">
                <ul className="flex flex-col justify-center mx-auto">
                  {matchRequests
                    .filter(
                      (request) => request.status === MatchStatus.REQUESTED
                    )
                    .map((request, index) => (
                      <li
                        className={`border border-gray-400 mt-10 flex flex-col shadow-lg rounded-xl w-[500px] h-[760px]`}
                        key={index}
                      >
                        {matchRequestsData[index] && (
                          <>
                            <img
                              src={matchRequestsData[index]?.image}
                              alt="user image"
                              className={`w-full h-[450px] items-center mx-auto rounded-xl flex justify-center`}
                            ></img>
                            <div className="px-5 py-5 grid grid-flow-col grid-rows-4 grid-cols-2 gap-x-2 gap-y-2">
                              <div className="flex flex-col justify-start">
                                <p className="text-gray-600 text-sm">Name</p>
                                <p className="text-lg text-black">
                                  {matchRequestsData[index]?.name}
                                </p>
                              </div>
                              <div className="flex flex-col justify-start">
                                <p className="text-gray-600 text-sm">Age</p>
                                <p className="text-lg text-black">
                                  {matchRequestsData[index]?.age}
                                </p>
                              </div>
                              <div className="flex flex-col justify-start">
                                <p className="text-gray-600 text-sm">Gender</p>
                                <p className="text-lg text-black">
                                  {matchRequestsData[index]?.gender}
                                </p>
                              </div>
                              <div className="flex flex-col justify-start">
                                <p className="text-gray-600 text-sm">
                                  Ethinicty
                                </p>
                                <p className="text-lg text-black">
                                  {matchRequestsData[index]?.ethnicity}
                                </p>
                              </div>
                              <div className="flex flex-col justify-start">
                                <p className="text-gray-600 text-sm">Zodiac</p>
                                <p className="text-lg text-black">
                                  {matchRequestsData[index]?.zodiac}
                                </p>
                              </div>
                              <div className="flex flex-col justify-start">
                                <p className="text-gray-600 text-sm">
                                  Type of Dating prefered
                                </p>
                                <p className="text-lg text-black">
                                  {matchRequestsData[index]?.tod}
                                </p>
                              </div>
                              <div className="flex flex-col justify-start">
                                <p className="text-gray-600 text-sm">
                                  Favourite Sport
                                </p>
                                <p className="text-lg text-black">
                                  {matchRequestsData[index]?.preferences.Sports}
                                </p>
                              </div>
                              <div className="flex flex-col justify-start">
                                <p className="text-gray-600 text-sm">
                                  Likes Travelling
                                </p>
                                <p className="text-lg text-black">
                                  {
                                    matchRequestsData[index]?.preferences
                                      .Travelling
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="flex w-full justify-evenly">
                              <button
                                onClick={() =>
                                  handleMatch(matchRequestsData[index].address)
                                }
                                className="bg-blue-500 text-white rounded-xl w-1/2 px-2 py-2 mx-2"
                              >
                                💜
                              </button>
                              <button className="bg-red-500 text-white rounded-xl w-1/2 px-2 py-2 mx-2">
                                ❌
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <div className="flex justify-center mx-auto">
                <Image
                  width={600}
                  height={500}
                  src={norequests}
                  alt="no matches"
                  className="rounded-xl"
                />
              </div>
            )}
          </TabPanel>
          <TabPanel>
            <div className="flex flex-col justify-center mx-auto">
              {userMatchData ? (
                <div
                  className={`border border-gray-400 flex flex-col  justify-center mx-auto shadow-lg rounded-xl w-[500px] h-[760px]`}
                >
                  <img
                    src={userMatchData?.image}
                    alt="user image"
                    className={`w-full h-[450px] items-center mx-auto rounded-xl flex justify-center`}
                  ></img>
                  <div className="px-5 py-5 grid grid-flow-col grid-rows-4 grid-cols-2 gap-x-2 gap-y-2">
                    <div className="flex flex-col justify-start">
                      <p className="text-gray-600 text-sm">Name</p>
                      <p className="text-lg text-black">
                        {userMatchData?.name}
                      </p>
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-gray-600 text-sm">Age</p>
                      <p className="text-lg text-black">{userMatchData?.age}</p>
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-gray-600 text-sm">Gender</p>
                      <p className="text-lg text-black">
                        {userMatchData?.gender}
                      </p>
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-gray-600 text-sm">Ethinicty</p>
                      <p className="text-lg text-black">
                        {userMatchData?.ethnicity}
                      </p>
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-gray-600 text-sm">Zodiac</p>
                      <p className="text-lg text-black">
                        {userMatchData?.zodiac}
                      </p>
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-gray-600 text-sm">
                        Type of Dating prefered
                      </p>
                      <p className="text-lg text-black">{userMatchData?.tod}</p>
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-gray-600 text-sm">Favourite Sport</p>
                      <p className="text-lg text-black">
                        {userMatchData?.preferences.Sports}
                      </p>
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-gray-600 text-sm">Likes Travelling</p>
                      <p className="text-lg text-black">
                        {userMatchData?.preferences.Travelling}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full justify-center mx-auto">
                    <button
                      onClick={() => handleUnMatch(userMatchData?.address)}
                      className="bg-red-500 text-white rounded-xl w-1/2 mx-auto px-2 py-2 "
                    >
                      Unmatch ❌
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center mx-auto">
                  <Image
                    width={500}
                    height={500}
                    src={nomatches}
                    alt="no matches"
                    className="rounded-xl"
                  />
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
