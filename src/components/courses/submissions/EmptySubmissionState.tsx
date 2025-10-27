interface EmptySubmissionStateProps {
  submissionType: string;
}

export const EmptySubmissionState = ({ submissionType }: EmptySubmissionStateProps) => {
  // Convert submission type to readable format
  const getReadableType = (type: string) => {
    const typeMap: Record<string, string> = {
      'assessments': 'assessment',
      'assignments': 'assignment',
      'projects': 'project',
      'quizzes': 'quiz',
      'coding': 'coding problem',
      'feedback': 'feedback form',
    };
    return typeMap[type] || type;
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <img
        src="/empty-submissions.png"
        alt="No submissions"
        width={120}
        height={120}
        className="mb-6"
      />
      <p className="text-center text-muted-foreground max-w-md">
        No {getReadableType(submissionType)} submissions available from the students yet. Please wait until the first submission.
      </p>
    </div>
  );
};