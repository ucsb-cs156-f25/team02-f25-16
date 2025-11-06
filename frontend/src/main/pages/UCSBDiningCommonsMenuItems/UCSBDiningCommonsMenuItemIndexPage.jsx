import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemTable from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemTable";
import { useCurrentUser, hasRole } from "main/utils/useCurrentUser";
import { Button } from "react-bootstrap";

export default function UCSBDiningCommonsMenuItemIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: menuItems,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/ucsbdiningcommonsmenuitems/all"],
    { method: "GET", url: "/api/ucsbdiningcommonsmenuitems/all" },
    [],
  );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/ucsbdiningcommonsmenuitems/create"
          style={{ float: "right" }}
        >
          Create UCSBDiningCommonsMenuItem
        </Button>
      );
    }
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>UCSBDiningCommonsMenuItems</h1>
        <UCSBDiningCommonsMenuItemTable
          ucsbdiningCommonsMenuItems={menuItems}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
