type CreateTagProps = {
  tagName: string;
  deleteTag: (arg0: string) => void;
}

export default function CreateTag( props: CreateTagProps ) {
  const {tagName, deleteTag} = props;
  return (
    <div className="flex justify-start items-center bg-gray-100 gap-2 py-1 pl-2 rounded-md">
      # 
      <span className="text-sm">{tagName}</span>
      <button
        onClick={() => deleteTag(tagName)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636l4.95 4.95z"></path>
        </svg>
      </button>
    </div>
  );
}