import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

export default function UCSBOrganizationTable({
  organizations,
  testIdPrefix = "UCSBOrganizationTable",
}) {

  const columns = [
    {
      header: "Organization Code",
      accessorKey: "orgCode", // accessor is the "key" in the data
    },
    {
      header: "Organization Translation Short",
      accessorKey: "orgTranslationShort",
    },
    {
      header: "Organization Translation",
      accessorKey: "orgTranslation",
    },
    {
      header: "Inactive",
      accessorKey: "inactive",
    },
  ];

  return (
    <OurTable data={organizations} columns={columns} testid={testIdPrefix} />
  );
}
