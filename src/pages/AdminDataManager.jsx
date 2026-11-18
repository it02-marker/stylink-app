import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdminRecordForm from './AdminRecordForm';
import CompanySettingsForms from './CompanySettingsForms';

async function readJson(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Request failed');
  return body;
}

function recordLabel(record) {
  return record.name
    || record.label
    || record.title
    || record.author
    || record.customer?.name
    || record.slug
    || record.code
    || 'Unnamed record';
}

function editableJson(record) {
  if (Array.isArray(record)) return record.map(editableJson);
  if (!record || typeof record !== 'object') return record;
  if (typeof record.toJSON === 'function') return editableJson(record.toJSON());
  if (typeof record.toHexString === 'function') return record.toHexString();

  return Object.fromEntries(
    Object.entries(record)
      .filter(([key]) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key))
      .map(([key, value]) => [key, editableJson(value)])
  );
}

export default function AdminDataManager() {
  const [resources, setResources] = useState([]);
  const [resourceKey, setResourceKey] = useState('');
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [recordData, setRecordData] = useState(null);
  const [schema, setSchema] = useState({ fields: [], references: {} });
  const [jsonText, setJsonText] = useState('');
  const [advancedMode, setAdvancedMode] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
  const [confirmationBusy, setConfirmationBusy] = useState(false);

  const selectedResource = resources.find((resource) => resource.key === resourceKey);
  const maxPage = Math.max(1, Math.ceil(total / 100));
  const visibleRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return records;
    return records.filter((record) => JSON.stringify(record).toLowerCase().includes(query));
  }, [records, search]);

  const loadRecords = useCallback(async () => {
    if (!resourceKey) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/resources/${resourceKey}?page=${page}`, { cache: 'no-store' });
      const data = await readJson(response);
      setRecords(data.items);
      setTotal(data.total);
      setSelectedIds([]);
      setSelectedId('');
      setRecordData(null);
      setJsonText('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [resourceKey, page]);

  useEffect(() => {
    if (!resourceKey) return undefined;
    let active = true;
    async function loadSchema() {
      setError('');
      try {
        const response = await fetch(`/api/admin/resources/${resourceKey}/schema`, { cache: 'no-store' });
        const data = await readJson(response);
        if (active) setSchema(data);
      } catch (requestError) {
        if (active) setError(requestError.message);
      }
    }
    loadSchema();
    return () => {
      active = false;
    };
  }, [resourceKey]);

  useEffect(() => {
    let active = true;
    async function loadResources() {
      try {
        const response = await fetch('/api/admin/resources', { cache: 'no-store' });
        const data = await readJson(response);
        if (active) {
          setResources(data);
          setResourceKey((current) => current || data[0]?.key || '');
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      }
    }
    loadResources();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  async function startNewRecord() {
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/resources/${resourceKey}/template`, { cache: 'no-store' });
      const template = await readJson(response);
      setSelectedId('');
      setRecordData(template);
      setJsonText(JSON.stringify(template, null, 2));
      setAdvancedMode(false);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function selectRecord(record) {
    setSelectedId(record._id);
    setRecordData(record);
    setJsonText(JSON.stringify(editableJson(record), null, 2));
    setAdvancedMode(false);
    setError('');
    setNotice('');
  }

  async function commitSave(document, recordId, bulkCreate) {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const url = recordId
        ? `/api/admin/resources/${resourceKey}/${recordId}`
        : `/api/admin/resources/${resourceKey}`;
      const response = await fetch(url, {
        method: recordId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(document),
      });
      const saved = await readJson(response);
      if (bulkCreate) {
        await loadRecords();
        setSelectedId('');
        setRecordData(null);
        setJsonText('');
        setAdvancedMode(false);
        setNotice(`${saved.length} records created.`);
        setResources((current) => current.map((resource) => (
          resource.key === resourceKey
            ? { ...resource, count: resource.count + saved.length }
            : resource
        )));
        return;
      }

      setSelectedId(saved._id);
      setRecordData(saved);
      setJsonText(JSON.stringify(editableJson(saved), null, 2));
      setNotice(recordId ? 'Record updated.' : 'Record created.');
      await loadRecords();
      setSelectedId(saved._id);
      setRecordData(saved);
      setJsonText(JSON.stringify(editableJson(saved), null, 2));
      setResources((current) => current.map((resource) => (
        resource.key === resourceKey
          ? { ...resource, count: resource.count + (recordId ? 0 : 1) }
          : resource
      )));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveRecord(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    try {
      const document = advancedMode ? JSON.parse(jsonText) : recordData;
      const bulkCreate = Array.isArray(document);
      if (bulkCreate && (selectedId || !advancedMode)) {
        throw new Error('Arrays are only supported when creating records in Advanced JSON mode.');
      }
      const documents = bulkCreate ? document : [document];
      if (
        documents.length === 0
        || documents.length > 50
        || documents.some((record) => !record || typeof record !== 'object' || Array.isArray(record))
      ) {
        throw new Error('Provide between 1 and 50 JSON record objects.');
      }

      const changeDescription = selectedId
        ? `update this record in ${selectedResource?.label}`
        : `create ${documents.length} record${documents.length === 1 ? '' : 's'} in ${selectedResource?.label}`;
      const recordId = selectedId;
      setPendingConfirmation({
        title: 'Confirm database change',
        message: `Are you sure you want to ${changeDescription}?`,
        confirmLabel: 'Confirm changes',
        onConfirm: () => commitSave(document, recordId, bulkCreate),
      });
    } catch (requestError) {
      setError(requestError instanceof SyntaxError ? `Invalid JSON: ${requestError.message}` : requestError.message);
    }
  }

  async function commitDeleteRecords(ids) {
    setError('');
    setNotice('');
    try {
      const response = await fetch(`/api/admin/resources/${resourceKey}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      const result = await readJson(response);
      setSelectedIds([]);
      setSelectedId('');
      setRecordData(null);
      setJsonText('');
      setNotice(`${result.deletedCount} record${result.deletedCount === 1 ? '' : 's'} deleted.`);
      await loadRecords();
      setResources((current) => current.map((resource) => (
        resource.key === resourceKey
          ? { ...resource, count: Math.max(0, resource.count - result.deletedCount) }
          : resource
      )));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function deleteRecords(ids) {
    const recordsToDelete = records.filter((record) => ids.includes(record._id));
    if (!recordsToDelete.length) return;
    const description = recordsToDelete.length === 1
      ? `"${recordLabel(recordsToDelete[0])}"`
      : `${recordsToDelete.length} selected records`;
    setPendingConfirmation({
      title: 'Delete records?',
      message: `Permanently delete ${description} from ${selectedResource?.label}? This cannot be undone and may affect records that reference them.`,
      confirmLabel: 'Delete permanently',
      destructive: true,
      onConfirm: () => commitDeleteRecords(ids),
    });
  }

  async function confirmPendingAction() {
    if (!pendingConfirmation || confirmationBusy) return;
    setConfirmationBusy(true);
    try {
      await pendingConfirmation.onConfirm();
      setPendingConfirmation(null);
    } finally {
      setConfirmationBusy(false);
    }
  }

  function toggleRecordSelection(id) {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((selectedId) => selectedId !== id)
      : [...current, id]);
  }

  function toggleVisibleSelection() {
    const visibleIds = visibleRecords.map((record) => record._id);
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) => allVisibleSelected
      ? current.filter((id) => !visibleIds.includes(id))
      : [...new Set([...current, ...visibleIds])]);
  }

  function changeResource(event) {
    setResourceKey(event.target.value);
    setPage(1);
    setSelectedIds([]);
    setSelectedId('');
    setRecordData(null);
    setJsonText('');
    setSearch('');
    setNotice('');
  }

  return (
    <section className="space-y-6">
      <div className="bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold">Database manager</h2>
        <p className="mt-1 text-sm text-slate-600">
          Edit records in every application collection using forms for all fields, nested data, and repeatable lists.
          System IDs and timestamps are managed automatically.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="min-w-52 flex-1 text-sm font-medium">
            Collection
            <select value={resourceKey} onChange={changeResource} className="admin-input">
              {resources.map((resource) => (
                <option key={resource.key} value={resource.key}>{resource.label} ({resource.count})</option>
              ))}
            </select>
          </label>
          <button type="button" onClick={startNewRecord} disabled={!resourceKey} className="bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50">
            New record
          </button>
          <button type="button" onClick={loadRecords} disabled={loading || !resourceKey} className="border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            Refresh
          </button>
        </div>
      </div>

      {error && <p role="alert" className="bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="bg-green-50 p-4 text-sm text-green-800">{notice}</p>}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section className="bg-white p-3 shadow-sm sm:p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-bold">{selectedResource?.label || 'Records'} <span className="font-normal text-slate-500">({total})</span></h3>
            <button
              type="button"
              onClick={() => deleteRecords(selectedIds)}
              disabled={!selectedIds.length || loading}
              className="bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Delete selected{selectedIds.length ? ` (${selectedIds.length})` : ''}
            </button>
          </div>
          {visibleRecords.length > 0 && (
            <label className="mb-2 flex items-center gap-2 border-b border-slate-200 pb-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={visibleRecords.every((record) => selectedIds.includes(record._id))}
                onChange={toggleVisibleSelection}
                className="h-4 w-4 accent-orange-600"
              />
              Select all {visibleRecords.length} visible
            </label>
          )}
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter this page"
            aria-label="Filter records on this page"
            className="admin-input mb-3 mt-0"
          />
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Loading records…</p>
          ) : (
            <div className="max-h-[48rem] space-y-1 overflow-auto">
              {visibleRecords.map((record) => (
                <article
                  key={record._id}
                  className={`group flex items-center gap-2 border p-2 transition ${
                    selectedId === record._id ? 'border-orange-500 bg-orange-50' : 'border-slate-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    aria-label={`Select ${recordLabel(record)}`}
                    checked={selectedIds.includes(record._id)}
                    onChange={() => toggleRecordSelection(record._id)}
                    className="h-4 w-4 shrink-0 accent-orange-600"
                  />
                  <button type="button" onClick={() => selectRecord(record)} className="min-w-0 flex-1 text-left hover:text-orange-700">
                    <span className="block truncate text-sm font-semibold">{recordLabel(record)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRecords([record._id])}
                    aria-label={`Delete ${recordLabel(record)}`}
                    title="Delete record"
                    className="shrink-0 p-2 text-red-700 opacity-0 transition-opacity hover:bg-red-50 group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <i className="fa-solid fa-trash" aria-hidden="true" />
                  </button>
                </article>
              ))}
              {visibleRecords.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No records on this page match.</p>}
            </div>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1 || loading} className="px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40">
              Previous
            </button>
            <span className="text-xs text-slate-500">Page {page} of {maxPage}</span>
            <button type="button" onClick={() => setPage((current) => Math.min(maxPage, current + 1))} disabled={page >= maxPage || loading} className="px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40">
              Next
            </button>
          </div>
        </section>

        <section className="bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold">{selectedId ? 'Edit record' : recordData ? 'New record' : 'Record editor'}</h3>
              <p className="mt-1 text-xs text-slate-500">Fields are validated by the database schema when saved.</p>
            </div>
            <div className="flex items-center gap-3">
              {recordData && (
                <button
                  type="button"
                  onClick={() => {
                    if (advancedMode) {
                      try {
                        const parsed = JSON.parse(jsonText);
                        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                          throw new Error('Record must be a JSON object.');
                        }
                        setRecordData(parsed);
                        setAdvancedMode(false);
                        setError('');
                      } catch (parseError) {
                        setError(parseError instanceof SyntaxError ? `Invalid JSON: ${parseError.message}` : parseError.message);
                      }
                    } else {
                      setJsonText(JSON.stringify(editableJson(recordData), null, 2));
                      setAdvancedMode(true);
                    }
                  }}
                  className="border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {advancedMode ? 'Use form' : 'Advanced JSON'}
                </button>
              )}
              {selectedId && (
                <button type="button" onClick={() => deleteRecords([selectedId])} className="border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
                  Delete
                </button>
              )}
            </div>
          </div>
          {resourceKey === 'company' && selectedId && recordData && !advancedMode ? (
            <CompanySettingsForms
              key={selectedId}
              fields={schema.fields}
              references={schema.references}
              value={recordData}
              saving={saving}
              onSave={(nextRecord) => setPendingConfirmation({
                title: 'Confirm database change',
                message: 'Are you sure you want to save these company settings?',
                confirmLabel: 'Confirm changes',
                onConfirm: () => commitSave(nextRecord, selectedId, false),
              })}
            />
          ) : (
          <form onSubmit={saveRecord}>
          {!recordData ? (
            <p className="border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              Select a record or choose New record.
            </p>
          ) : advancedMode ? (
            <div>
              {!selectedId && (
                <p className="mb-2 text-xs text-slate-500">Paste one JSON object or an array of up to 50 records to insert multiple records.</p>
              )}
              <textarea
                value={jsonText}
                onChange={(event) => setJsonText(event.target.value)}
                spellCheck="false"
                aria-label="Record JSON"
                className="min-h-[28rem] w-full border border-slate-300 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-100 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          ) : (
            <AdminRecordForm
              fields={schema.fields}
              references={schema.references}
              value={recordData}
              onChange={(nextValue) => {
                setRecordData(nextValue);
                setJsonText(JSON.stringify(editableJson(nextValue), null, 2));
              }}
            />
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" disabled={saving || !recordData} className="bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-wait disabled:opacity-50">
              {saving ? 'Saving…' : selectedId ? 'Save changes' : 'Create record'}
            </button>
            <button type="button" onClick={() => { setSelectedId(''); setRecordData(null); setJsonText(''); setNotice(''); setAdvancedMode(false); }} className="border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
          </div>
          </form>
          )}
        </section>
      </div>
      {pendingConfirmation && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !confirmationBusy) setPendingConfirmation(null);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && !confirmationBusy) setPendingConfirmation(null);
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-confirmation-title"
            aria-describedby="admin-confirmation-message"
            className="w-full max-w-md bg-white p-6 shadow-2xl"
          >
            <div className={`mb-4 flex h-11 w-11 items-center justify-center ${pendingConfirmation.destructive ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
              <i className={`fa-solid ${pendingConfirmation.destructive ? 'fa-triangle-exclamation' : 'fa-circle-question'}`} aria-hidden="true" />
            </div>
            <h2 id="admin-confirmation-title" className="text-xl font-bold text-slate-900">
              {pendingConfirmation.title}
            </h2>
            <p id="admin-confirmation-message" className="mt-2 text-sm leading-6 text-slate-600">
              {pendingConfirmation.message}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={confirmationBusy}
                onClick={() => setPendingConfirmation(null)}
                className="border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                autoFocus
                disabled={confirmationBusy}
                onClick={confirmPendingAction}
                className={`px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60 ${pendingConfirmation.destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}`}
              >
                {confirmationBusy ? 'Working…' : pendingConfirmation.confirmLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
