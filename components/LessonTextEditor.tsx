import React, { useState } from "react";

interface Props {
  content: string;
  onChange: (content: string) => void;
}

const LessonTextEditor: React.FC<Props> = ({ content, onChange }) => {
  return (
    <div className="border border-slate-300 rounded-sm overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-300 p-2 flex gap-2">
        <button
          type="button"
          className="p-1 hover:bg-slate-200 rounded font-bold text-xs"
          onClick={() => onChange(content + "**bold**")}
        >
          B
        </button>
        <button
          type="button"
          className="p-1 hover:bg-slate-200 rounded italic text-xs"
          onClick={() => onChange(content + "*italic*")}
        >
          I
        </button>
        <button
          type="button"
          className="p-1 hover:bg-slate-200 rounded text-xs underline"
          onClick={() => onChange(content + "__underline__")}
        >
          U
        </button>
        <div className="w-px bg-slate-300 mx-1"></div>
        <button
          type="button"
          className="p-1 hover:bg-slate-200 rounded text-xs"
          onClick={() => onChange(content + "\n- list item")}
        >
          List
        </button>
      </div>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 focus:outline-none min-h-[200px]"
        placeholder="Wpisz treść lekcji..."
      />
    </div>
  );
};

export default LessonTextEditor;
