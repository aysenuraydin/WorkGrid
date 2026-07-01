interface CellProps { val: string; colClass: string; clssnm: string; prefix: string; suffix: string; }

/**
 * DefaultCell — düz metin değerini prefix/suffix ve kırpma ile gösterir. 
 *  20 karakterden uzun değeri "..." ile kısaltır; başına prefix, sonuna suffix
 *  ekler. Gizlenmiştir. 
 */
export const DefaultCell = (_props: CellProps): JSX.Element => {
  throw new Error("Source available on request.");
};
