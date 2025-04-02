import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Divider } from "@aws-amplify/ui-react";
import {
  AtSign,
  BriefcaseBusiness,
  Building2,
  Files,
  MoreVertical,
  Pencil,
  Smartphone,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import ProgressBar from "./progress-bar";
import Link from "next/link";

interface UserDetails {
  name: string;
  role: string;
  location: string;
  department: string;
  shift: string;
  TimeZone: string;
  seatingLocation: string;
  email: string;
  mobileNo: string;
  workNo: string;
  about: string;
  employeeID: string;
  nickName: string;
  firstName: string;
  lastName: string;
  division: string;
  designation: string;
  employmentType: string;
  employeeStatus: string;
  source: string;
  doj: string;
  experience: string;
  dob: string;
  maritalStatus: string;
  gender: string;
  expertise: string;
  tags: string;
  address: string;
}

function UserDetails({ userDetails }: { userDetails?: UserDetails[] }) {
  const [taskDetails, setTaskDetails] = useState([
    {
      logo: "",
      name: "UI Design",
      time: "updated 2 hours ago",
      progress: "60",
      hoursSpent: "4:25",
    },
    {
      logo: "",
      name: "Front end components",
      time: "updated 1 day ago",
      progress: "85",
      hoursSpent: "18:25",
    },
  ]);

  // Ensure userDetails exists and has data
  const user = userDetails && userDetails.length > 0 ? userDetails[0] : null;

  return (
    <>
      <div className="font-sans md:flex-row flex-col flex gap-4">
        <>
          <Card className="sm:basis-1/5 h-max">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Profile</CardTitle>
                <CardDescription className="hover:cursor-pointer">
                  <Link href="/profile/editprofile">
                    <Pencil className="size-6 hover:bg-slate-100 rounded-lg p-1" />
                  </Link>
                </CardDescription>
              </div>
            </CardHeader>
            <Divider orientation="horizontal" size="small" />
            <CardContent>
              <div className="flex flex-col p-3 gap-4 text-sm">
                <div className="text-muted-foreground">ABOUT</div>
                {user ? (
                  <>
                    <div className="flex gap-3 font-semibold">
                      <User className="size-6 bg-pink-200 p-1 rounded-md text-pink-600 text-muted-foreground" />
                      {user.name}
                    </div>
                    <div className="flex gap-3 font-semibold">
                      <BriefcaseBusiness className="size-6 bg-cyan-200 p-1 rounded-md text-cyan-600 text-muted-foreground" />
                      {user.role}
                    </div>
                    <div className="flex gap-3 font-semibold">
                      <Building2 className="size-6 bg-amber-200 p-1 rounded-md text-amber-600 text-muted-foreground" />
                      HtmlStream
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    User details not available.
                  </p>
                )}
              </div>

              <div className="flex flex-col p-3 gap-4 text-sm justify-center">
                <div className="text-muted-foreground">CONTACTS</div>
                {user ? (
                  <>
                    <div className="flex gap-3 font-semibold">
                      <AtSign className="size-6 bg-red-200 p-1 rounded-md text-red-600 text-muted-foreground" />
                      {user.email}
                    </div>
                    <div className="flex gap-3 font-semibold">
                      <Smartphone className="size-6 bg-fuchsia-200 p-1 rounded-md text-fuchsia-600 text-muted-foreground" />
                      {user.mobileNo}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    No contact details available.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  <MoreVertical className="size-5 text-muted-foreground" />
                </CardDescription>
              </div>
            </CardHeader>
            <Divider orientation="horizontal" size="small" />
            <CardContent className="p-0">
              <div className="flex flex-col h-max">
                <div className="p-2 h-max bg-slate-100 w-full flex text-sm text-muted-foreground">
                  <div className="basis-1/2">PROJECT</div>
                  <div className="basis-1/3">PROGRESS</div>
                  <div>HOUR</div>
                </div>
                {taskDetails.length > 0 ? (
                  taskDetails.map((task, i) => (
                    <div
                      key={i}
                      className="p-2 h-max w-full items-center flex text-sm"
                    >
                      <div className="basis-1/2 flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                        <div className="flex-col flex gap-1">
                          <div className="font-semibold">{task.name}</div>
                          <div className="text-muted-foreground">
                            {task.time}
                          </div>
                        </div>
                      </div>
                      <div className="basis-1/3">
                        <div>{task.progress}%</div>
                        <div>
                          <ProgressBar progress={task.progress} />
                        </div>
                      </div>
                      <div>{task.hoursSpent}</div>
                    </div>
                  ))
                ) : (
                  <p className="p-2 text-muted-foreground">
                    No tasks available.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      </div>
    </>
  );
}

export default UserDetails;
