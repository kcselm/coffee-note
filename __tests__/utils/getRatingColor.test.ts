import { getRatingColor } from "~/components/ReviewDetails";

jest.mock("~/trpc/react", () => ({
  api: {
    review: {
      delete: {
        useMutation: jest.fn().mockReturnValue({
          mutate: jest.fn(),
        }),
      },
    },
  },
}));

describe("getRatingColor", () => {
  test("returns bg-green-500 for ratings 9 and above", () => {
    expect(getRatingColor(9)).toBe("bg-green-500");
    expect(getRatingColor(10)).toBe("bg-green-500");
  });

  test("returns bg-lime-500 for ratings between 7 and 8", () => {
    expect(getRatingColor(7)).toBe("bg-lime-500");
    expect(getRatingColor(8)).toBe("bg-lime-500");
  });

  test("returns bg-yellow-500 for ratings between 5 and 6", () => {
    expect(getRatingColor(5)).toBe("bg-yellow-500");
    expect(getRatingColor(6)).toBe("bg-yellow-500");
  });

  test("returns bg-orange-500 for ratings between 3 and 4", () => {
    expect(getRatingColor(3)).toBe("bg-orange-500");
    expect(getRatingColor(4)).toBe("bg-orange-500");
  });

  test("returns bg-red-500 for ratings 2 and below", () => {
    expect(getRatingColor(1)).toBe("bg-red-500");
    expect(getRatingColor(2)).toBe("bg-red-500");
  });
});
