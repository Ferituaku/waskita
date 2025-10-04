import React from "react";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout removes the sidebar and provides a clean slate
  // for the immersive quiz experience.
  return <>{children}</>;
}
