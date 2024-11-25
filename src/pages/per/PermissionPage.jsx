import DefaultLayout from "../../layouts/DefaultLayout";
import PermissionsTable from "./PermissionTable";

function PermissionPages() {
  return (
    <DefaultLayout>
      <div className="p-2">
        <PermissionsTable />
      </div>
    </DefaultLayout>
  );
}

export default PermissionPages;
