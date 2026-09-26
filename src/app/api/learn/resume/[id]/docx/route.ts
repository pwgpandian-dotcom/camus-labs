import { NextResponse } from "next/server";
import { Packer } from "docx";
import { getLearner } from "@/lib/learn/server";
import { resumeDataSchema } from "@/lib/learn/schemas";
import { buildDocx } from "@/lib/learn/resume-docx";

export async function GET(_req: Request, ctx: RouteContext<"/api/learn/resume/[id]/docx">) {
  const { id } = await ctx.params;
  const learner = await getLearner();
  if (!learner) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { data: resume } = await learner.supabase.from("learn_resumes").select("title, data").eq("id", id).maybeSingle();
  if (!resume) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const data = resumeDataSchema.parse(resume.data ?? {});
  const buffer = await Packer.toBuffer(buildDocx(data));
  const filename = (resume.title || "resume").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") || "resume";
  return new Response(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "content-disposition": `attachment; filename="${filename}.docx"`,
      "cache-control": "no-store",
    },
  });
}
