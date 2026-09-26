import { AlertCircle, RefreshCw } from 'lucide-react'
export const LoadingBlock=({label='Loading intelligence…'}:{label?:string})=><div className="state loading"><span className="spinner"/>{label}</div>
export const EmptyBlock=({label}:{label:string})=><div className="state"><span className="empty-ring"/> {label}</div>
export const ErrorBlock=({retry,label='Unable to load data'}:{retry?:()=>void;label?:string})=><div className="state error"><AlertCircle size={20}/><div><b>{label}</b><small>Please try again.</small></div>{retry&&<button className="text-button" onClick={retry}><RefreshCw size={14}/> Retry</button>}</div>
export const Value=({children}:{children:React.ReactNode})=><span className="metric-value">{children}</span>
