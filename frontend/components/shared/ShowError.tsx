"use client";

const ShowError = ({ error }: { error: string }) => {
  return <p className="text-red-500 text-sm p-1">{error}</p>;
};

export default ShowError;
