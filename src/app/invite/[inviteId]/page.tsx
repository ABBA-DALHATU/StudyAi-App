import { acceptInvite } from "@/actions";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: { inviteId: string };
};

export default async function Page({ params: { inviteId } }: Props) {
  const invite = await acceptInvite(inviteId);
  if (invite.status === 404) return redirect("/auth/sign-in");

  if (invite?.status === 401) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Not Authorized
          </h1>
          <p className="text-gray-600 mb-4">
            You don&apos;t have permission to access this invite.
          </p>
          {/* <a
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Return to Dashboard
          </a> */}
        </div>
      </div>
    );
  }

  if (invite?.status === 200) return redirect("/auth/callback");
}
