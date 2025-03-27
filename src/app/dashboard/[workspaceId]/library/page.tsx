import { DigitalLibrary } from "@/components/pages/digitalLibrary/digital-library";

export default function LibraryPage({
  params: { workspaceId },
}: {
  params: { workspaceId: string };
}) {
  return <DigitalLibrary workspaceId={workspaceId} />;
}
