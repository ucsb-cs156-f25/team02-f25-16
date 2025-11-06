import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/recommendationRequestUtils";
import mockConsole from "tests/testutils/mockConsole";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

describe("recommendationRequestUtils", () => {
  describe("onDeleteSuccess", () => {
    test("It logs the message and shows toast", () => {
      const restoreConsole = mockConsole();

      onDeleteSuccess("deleted!");

      expect(mockToast).toHaveBeenCalledWith("deleted!");
      expect(console.log).toHaveBeenCalled();
      expect(console.log.mock.calls[0][0]).toMatch("deleted!");

      restoreConsole();
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    test("It returns the correct axios params", () => {
      const cell = { row: { original: { id: 42 } } };

      const result = cellToAxiosParamsDelete(cell);

      expect(result).toEqual({
        url: "/api/recommendationrequests",
        method: "DELETE",
        params: { id: 42 },
      });
    });
  });
});
