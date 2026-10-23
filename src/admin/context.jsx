import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, AlertTriangle, X } from 'lucide-react'
import { api, post, setCsrf, setUnauthorizedHandler } from './api'
import seed from '../content/seed-content.json'

/* ---------------- Session ---------------- */

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = vérification en cours

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null))
    api('me')
      .then((data) => {
        setCsrf(data.csrf)
        setUser(data.user)
      })
      .catch(() => setUser(null))
  }, [])

  const login = async (email, password) => {
    const data = await post('login', { email, password })
    setCsrf(data.csrf)
    setUser(data.user)
  }

  const logout = async () => {
    await post('logout').catch(() => {})
    setCsrf('')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/* ---------------- Contenu du site ---------------- */

const ContentContext = createContext(null)
export const useContent = () => useContext(ContentContext)

export function ContentProvider({ children }) {
  const [state, setState] = useState({ loading: true, error: '', content: null, version: 0, updatedAt: null, updatedBy: null })
  const toast = useToast()

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: '' }))
    api('content')
      .then((data) => setState({
        loading: false,
        error: '',
        // Premier lancement : on part du contenu actuellement affiché sur le site.
        content: data.content ?? structuredClone(seed),
        version: data.version,
        updatedAt: data.updatedAt,
        updatedBy: data.updatedBy,
      }))
      .catch((err) => setState((s) => ({ ...s, loading: false, error: err.message })))
  }, [])

  useEffect(load, [load])

  /** Enregistre le contenu complet. `update` reçoit une copie modifiable du contenu actuel. */
  const save = useCallback(async (update, summary) => {
    const next = structuredClone(state.content)
    update(next)
    try {
      const data = await post('save_content', { content: next, baseVersion: state.version, summary })
      setState((s) => ({ ...s, content: data.content, version: data.version, updatedAt: data.updatedAt, updatedBy: 'vous' }))
      toast.success('Enregistré. Les changements sont visibles sur le site.')
      return true
    } catch (err) {
      if (err.data?.conflict) {
        toast.error(err.message, { label: 'Recharger', onClick: load })
      } else {
        toast.error(err.message)
      }
      return false
    }
  }, [state.content, state.version, toast, load])

  const replace = useCallback((data) => {
    setState((s) => ({ ...s, content: data.content, version: data.version }))
  }, [])

  return (
    <ContentContext.Provider value={{ ...state, save, reload: load, replace }}>
      {children}
    </ContentContext.Provider>
  )
}

/* ---------------- Notifications ---------------- */

const ToastContext = createContext(null)
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(1)

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])

  const push = useCallback((type, message, action) => {
    const id = nextId.current++
    setToasts((list) => [...list.slice(-3), { id, type, message, action }])
    setTimeout(() => dismiss(id), type === 'error' ? 9000 : 4000)
  }, [dismiss])

  const value = useMemo(() => ({
    success: (message) => push('success', message),
    error: (message, action) => push('error', message, action),
  }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="adm-toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`adm-toast adm-toast-${t.type}`}>
            {t.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            <span>{t.message}</span>
            {t.action && (
              <button className="adm-toast-action" onClick={() => { t.action.onClick(); dismiss(t.id) }}>
                {t.action.label}
              </button>
            )}
            <button className="adm-toast-close" onClick={() => dismiss(t.id)} aria-label="Fermer"><X size={16} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

/* ---------------- Confirmation ---------------- */

const ConfirmContext = createContext(null)

/** const confirm = useConfirm(); if (await confirm({ title, message, danger: true })) ... */
export const useConfirm = () => useContext(ConfirmContext)

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null)

  const confirm = useCallback((options) => new Promise((resolve) => {
    setDialog({ ...options, resolve })
  }), [])

  const close = (value) => {
    dialog.resolve(value)
    setDialog(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialog && (
        <div className="adm-modal-backdrop" onClick={() => close(false)}>
          <div className="adm-modal adm-confirm" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3>{dialog.title}</h3>
            {dialog.message && <p>{dialog.message}</p>}
            <div className="adm-modal-actions">
              <button className="adm-btn" onClick={() => close(false)} autoFocus>Annuler</button>
              <button className={`adm-btn ${dialog.danger ? 'adm-btn-danger' : 'adm-btn-primary'}`} onClick={() => close(true)}>
                {dialog.confirmLabel || 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}
