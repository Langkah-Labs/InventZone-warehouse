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
import { Team, TeamInput } from "@/types/team";
import { GetServerSideProps } from "next";

const raleway = Raleway({ subsets: ["latin"] });

const findTeamByIdQuery = `
  query FindTeamById($id: bigint!) {
    teams_by_pk(id: $id) {
      id
      name
      created_at
      updated_at
    }
  }
`;

const updateTeamMutation = `
  mutation UpdateTeamById($id: bigint!, $name: String!) {
    update_teams_by_pk(pk_columns: {id: $id}, _set: {name: $name}) {
      id
      name
      created_at
      updated_at
    }
  }
`;

type PageProps = {
  team?: Team;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
  const { id } = ctx.query;

  try {
    const result = await graphqlRequest.request<any>(findTeamByIdQuery, {
      id,
    });

    return {
      props: {
        team: result["teams_by_pk"],
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        team: {},
      },
    };
  }
};

const Teams: NextPageWithLayout<PageProps> = ({ team }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamInput>();

  const onSubmit: SubmitHandler<TeamInput> = async (data) => {
    if (!router.isReady) return;

    const { id } = router.query;

    try {
      setIsLoading(true);
      await graphqlRequest.request(updateTeamMutation, {
        ...data,
        id,
      });

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
                Team
              </h2>
              <p className="mt-2 max-w-2xl leading-6 body-base-regular text-gray-400">
                Team data entry form. This form provides information from the
                team name.
              </p>

              <div className="font-sans mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
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
                      defaultValue={team?.name}
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
              href="/users/teams/"
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
