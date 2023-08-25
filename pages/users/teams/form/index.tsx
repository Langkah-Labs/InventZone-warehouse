import { ReactElement, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Raleway } from "next/font/google";
import type { NextPageWithLayout } from "../../../_app";
import { useForm, SubmitHandler } from "react-hook-form";
import swal from "sweetalert";
import { graphqlRequest } from "@/utils/graphql";
import SidebarLayout from "@/components/elements/SideBarLayout";
import Loading from "@/components/elements/Loading";
import { TeamInput } from "@/types/team";

const raleway = Raleway({ subsets: ["latin"] });

const insertTeamMutation = `
  mutation InsertOneTeam($name: String!) {
    insert_teams_one(object: {name: $name}) {
      id
      name
      created_at
      updated_at
    }
  }
`;

const Teams: NextPageWithLayout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamInput>();

  const onSubmit: SubmitHandler<TeamInput> = async (data) => {
    if (!router.isReady) return;

    try {
      setIsLoading(true);
      await graphqlRequest.request(insertTeamMutation, data);

      swal({
        title: "Success!",
        text: "Your data has been saved!",
        icon: "success",
      }).then(() => {
        router.push("/users/teams");
      });
    } catch (err) {
      console.error(err);
      swal({
        title: "Failed!",
        text: "Oops, something went wrong",
        icon: "error",
      }).then(() => {
        if (router.isReady) {
          router.push("/users/teams");
        }
      });
    }
  };

  return (
    <main className={`${raleway.className}`}>
      {isLoading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12 sm:space-y-16">
            <div>
              <h2 className="body-4large-bold leading-7 text-[#113A5D]">
                Input Team
              </h2>
              <p className="mt-2 max-w-2xl leading-6 body-base-regular text-gray-400">
                Team data entry form. This form provides information from the
                team name.
              </p>

              <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >
                    Team Name
                    <span className="text-[#C23A3A]">*</span>
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <input
                      type="text"
                      id="name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      defaultValue={""}
                      required
                      {...register("name")}
                    />
                    {/* <p className="mt-3 text-sm leading-6 text-gray-600">{hint}</p> */}
                  </div>
                </div>
              </div>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                <b>Note:&nbsp;</b>(<span className="text-[#C23A3A]">*</span>) is
                required
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Link
              href="/products"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md bg-[#113A5D] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </main>
  );
};

Teams.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default Teams;
