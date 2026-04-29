"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAdminTourSurveyForms,
  useCreateAdminTourSurveyForm,
  useUpdateAdminTourSurveyForm,
  useDeleteAdminTourSurveyForm,
} from "@/queries/useTourSurveyQueries";
import type {
  TourSurveyForm,
  TourSurveyQuestionType,
  UpsertTourSurveyFormRequest,
  UpsertTourSurveyQuestionRequest,
  UpsertTourSurveyOptionRequest,
} from "@/api/tourSurvey";

// ── 기본값 팩토리 ──────────────────────────────────────────
function newOption(sortOrder: number): UpsertTourSurveyOptionRequest {
  return {
    optionKey: "",
    label: "",
    description: "",
    imageUrl: "",
    sortOrder,
    tourAreaCode: undefined,
    tourSignguCode: undefined,
    placeLabel: "",
    categoryTag: "",
    styleTag: "",
  };
}

function newQuestion(sortOrder: number): UpsertTourSurveyQuestionRequest {
  return {
    questionKey: "",
    title: "",
    description: "",
    sortOrder,
    type: "SINGLE_CHOICE",
    required: true,
    options: [newOption(0)],
  };
}

function emptyForm(): UpsertTourSurveyFormRequest {
  return {
    name: "",
    code: "",
    description: "",
    isActive: true,
    questions: [newQuestion(0)],
  };
}

function formToRequest(form: TourSurveyForm): UpsertTourSurveyFormRequest {
  return {
    name: form.name,
    code: form.code,
    description: form.description ?? "",
    isActive: form.isActive,
    questions: form.questions.map(q => ({
      questionKey: q.questionKey,
      title: q.title,
      description: q.description ?? "",
      sortOrder: q.sortOrder,
      type: q.type,
      required: q.required,
      options: q.options.map(o => ({
        optionKey: o.optionKey,
        label: o.label,
        description: o.description ?? "",
        imageUrl: o.imageUrl ?? "",
        sortOrder: o.sortOrder,
        tourAreaCode: o.tourAreaCode,
        tourSignguCode: o.tourSignguCode,
        placeLabel: o.placeLabel ?? "",
        categoryTag: o.categoryTag ?? "",
        styleTag: o.styleTag ?? "",
      })),
    })),
  };
}

// ── 입력 필드 공통 스타일 ──────────────────────────────────
const inputCls =
  "w-full px-2 py-1.5 rounded bg-gray-800 border border-gray-600 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gray-400";
const labelCls = "block text-xs text-gray-400 mb-0.5";

// ── 옵션 편집 ──────────────────────────────────────────────
function OptionEditor({
  opt,
  onChange,
  onRemove,
}: {
  opt: UpsertTourSurveyOptionRequest;
  onChange: (next: UpsertTourSurveyOptionRequest) => void;
  onRemove: () => void;
}) {
  const set = <K extends keyof UpsertTourSurveyOptionRequest>(
    key: K,
    value: UpsertTourSurveyOptionRequest[K]
  ) => onChange({ ...opt, [key]: value });

  return (
    <div className="border border-gray-700 rounded p-3 space-y-2 bg-gray-900/50">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400 font-medium">
          옵션 #{opt.sortOrder + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-red-400 hover:text-red-300"
        >
          삭제
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>optionKey *</label>
          <input
            className={inputCls}
            value={opt.optionKey}
            onChange={e => set("optionKey", e.target.value)}
            placeholder="spring_day_jumunjin"
          />
        </div>
        <div>
          <label className={labelCls}>label *</label>
          <input
            className={inputCls}
            value={opt.label}
            onChange={e => set("label", e.target.value)}
            placeholder="강릉 - 주문진"
          />
        </div>
        <div>
          <label className={labelCls}>description</label>
          <input
            className={inputCls}
            value={opt.description ?? ""}
            onChange={e => set("description", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>imageUrl</label>
          <input
            className={inputCls}
            value={opt.imageUrl ?? ""}
            onChange={e => set("imageUrl", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>tourAreaCode</label>
          <input
            type="number"
            className={inputCls}
            value={opt.tourAreaCode ?? ""}
            onChange={e =>
              set(
                "tourAreaCode",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
        </div>
        <div>
          <label className={labelCls}>tourSignguCode</label>
          <input
            type="number"
            className={inputCls}
            value={opt.tourSignguCode ?? ""}
            onChange={e =>
              set(
                "tourSignguCode",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
        </div>
        <div>
          <label className={labelCls}>placeLabel</label>
          <input
            className={inputCls}
            value={opt.placeLabel ?? ""}
            onChange={e => set("placeLabel", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>categoryTag</label>
          <input
            className={inputCls}
            value={opt.categoryTag ?? ""}
            onChange={e => set("categoryTag", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>styleTag</label>
          <input
            className={inputCls}
            value={opt.styleTag ?? ""}
            onChange={e => set("styleTag", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>sortOrder *</label>
          <input
            type="number"
            className={inputCls}
            value={opt.sortOrder}
            onChange={e => set("sortOrder", Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}

// ── 질문 편집 ──────────────────────────────────────────────
function QuestionEditor({
  q,
  index,
  onChange,
  onRemove,
}: {
  q: UpsertTourSurveyQuestionRequest;
  index: number;
  onChange: (next: UpsertTourSurveyQuestionRequest) => void;
  onRemove: () => void;
}) {
  const set = <K extends keyof UpsertTourSurveyQuestionRequest>(
    key: K,
    value: UpsertTourSurveyQuestionRequest[K]
  ) => onChange({ ...q, [key]: value });

  const addOption = () =>
    set("options", [...q.options, newOption(q.options.length)]);

  const updateOption = (i: number, next: UpsertTourSurveyOptionRequest) =>
    set(
      "options",
      q.options.map((o, idx) => (idx === i ? next : o))
    );

  const removeOption = (i: number) =>
    set(
      "options",
      q.options.filter((_, idx) => idx !== i)
    );

  return (
    <div className="border border-gray-600 rounded-lg p-4 space-y-3 bg-gray-800/40">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-200">
          질문 #{index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-red-400 hover:text-red-300"
        >
          질문 삭제
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelCls}>questionKey *</label>
          <input
            className={inputCls}
            value={q.questionKey}
            onChange={e => set("questionKey", e.target.value)}
            placeholder="location"
          />
        </div>
        <div>
          <label className={labelCls}>title *</label>
          <input
            className={inputCls}
            value={q.title}
            onChange={e => set("title", e.target.value)}
            placeholder="어떤 장소를 좋아하시나요?"
          />
        </div>
        <div>
          <label className={labelCls}>description</label>
          <input
            className={inputCls}
            value={q.description ?? ""}
            onChange={e => set("description", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>sortOrder *</label>
          <input
            type="number"
            className={inputCls}
            value={q.sortOrder}
            onChange={e => set("sortOrder", Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelCls}>type *</label>
          <select
            className={inputCls}
            value={q.type}
            onChange={e =>
              set("type", e.target.value as TourSurveyQuestionType)
            }
          >
            <option value="SINGLE_CHOICE">SINGLE_CHOICE</option>
            <option value="MULTIPLE_CHOICE">MULTIPLE_CHOICE</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-5">
          <input
            type="checkbox"
            id={`required-${index}`}
            checked={q.required}
            onChange={e => set("required", e.target.checked)}
            className="accent-pink-500"
          />
          <label
            htmlFor={`required-${index}`}
            className="text-sm text-gray-300"
          >
            필수 응답
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">
            선택지 ({q.options.length}개)
          </span>
          <button
            type="button"
            onClick={addOption}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            + 선택지 추가
          </button>
        </div>
        {q.options.map((opt, i) => (
          <OptionEditor
            key={i}
            opt={opt}
            onChange={next => updateOption(i, next)}
            onRemove={() => removeOption(i)}
          />
        ))}
      </div>
    </div>
  );
}

// ── 설문 폼 다이얼로그 ─────────────────────────────────────
function SurveyFormDialog({
  open,
  onClose,
  editTarget,
}: {
  open: boolean;
  onClose: () => void;
  editTarget: TourSurveyForm | null;
}) {
  const isEdit = editTarget !== null;
  const [form, setForm] = useState<UpsertTourSurveyFormRequest>(() =>
    editTarget ? formToRequest(editTarget) : emptyForm()
  );

  const createMutation = useCreateAdminTourSurveyForm();
  const updateMutation = useUpdateAdminTourSurveyForm();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  const set = <K extends keyof UpsertTourSurveyFormRequest>(
    key: K,
    value: UpsertTourSurveyFormRequest[K]
  ) => setForm(prev => ({ ...prev, [key]: value }));

  const addQuestion = () =>
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion(prev.questions.length)],
    }));

  const updateQuestion = (
    i: number,
    next: UpsertTourSurveyQuestionRequest
  ) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, idx) => (idx === i ? next : q)),
    }));
  };

  const removeQuestion = (i: number) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== i),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpsertTourSurveyFormRequest = {
      ...form,
      description: form.description?.trim() || undefined,
    };
    if (isEdit) {
      updateMutation.mutate(
        { formId: editTarget.id, request: payload },
        { onSuccess: onClose }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "설문 템플릿 수정" : "설문 템플릿 생성"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>이름 *</label>
              <input
                className={inputCls}
                value={form.name}
                onChange={e => set("name", e.target.value)}
                placeholder="BTS MV Trip Finder"
                required
              />
            </div>
            <div>
              <label className={labelCls}>코드 *</label>
              <input
                className={inputCls}
                value={form.code}
                onChange={e => set("code", e.target.value.toUpperCase())}
                placeholder="BTS_MV_TRIP"
                required
              />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>설명</label>
              <textarea
                className={inputCls + " resize-none"}
                rows={2}
                value={form.description ?? ""}
                onChange={e => set("description", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={e => set("isActive", e.target.checked)}
                className="accent-pink-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-300">
                활성화
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-200">
                질문 목록 ({form.questions.length}개)
              </span>
              <button
                type="button"
                onClick={addQuestion}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                + 질문 추가
              </button>
            </div>
            {form.questions.map((q, i) => (
              <QuestionEditor
                key={i}
                q={q}
                index={i}
                onChange={next => updateQuestion(i, next)}
                onRemove={() => removeQuestion(i)}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm">
              오류: {(error as { message?: string }).message ?? "요청 실패"}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "저장 중..." : isEdit ? "수정" : "생성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── 메인 패널 ──────────────────────────────────────────────
export function AdminTourSurveysPanel() {
  const { data: forms = [], isLoading } = useAdminTourSurveyForms();
  const deleteMutation = useDeleteAdminTourSurveyForm();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TourSurveyForm | null>(null);

  const openCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (form: TourSurveyForm) => {
    setEditTarget(form);
    setDialogOpen(true);
  };

  const handleDelete = (form: TourSurveyForm) => {
    if (
      !confirm(
        `"${form.name}" 설문을 삭제하시겠습니까?\n삭제된 설문은 복구할 수 없습니다.`
      )
    )
      return;
    deleteMutation.mutate(form.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">
          설문 템플릿 관리
        </h2>
        <Button size="sm" onClick={openCreate}>
          + 설문 생성
        </Button>
      </div>

      {isLoading && (
        <p className="text-gray-400 text-sm">로딩 중...</p>
      )}

      {!isLoading && forms.length === 0 && (
        <p className="text-gray-500 text-sm">등록된 설문 템플릿이 없습니다.</p>
      )}

      <div className="space-y-2">
        {forms.map(form => (
          <div
            key={form.id}
            className="border border-gray-700 rounded-lg p-4 bg-gray-800/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-white text-sm">
                    {form.name}
                  </span>
                  <code className="text-xs text-pink-400 bg-pink-950/40 px-1.5 py-0.5 rounded">
                    {form.code}
                  </code>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      form.isActive
                        ? "bg-green-900/50 text-green-400"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {form.isActive ? "활성" : "비활성"}
                  </span>
                </div>
                {form.description && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                    {form.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  질문 {form.questions.length}개 · ID: {form.id}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:text-white text-xs h-7 px-2"
                  onClick={() => openEdit(form)}
                >
                  수정
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-800 text-red-400 hover:text-red-300 text-xs h-7 px-2"
                  onClick={() => handleDelete(form)}
                  disabled={deleteMutation.isPending}
                >
                  삭제
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {dialogOpen && (
        <SurveyFormDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          editTarget={editTarget}
        />
      )}
    </div>
  );
}
