import { useEffect } from 'react';
import { DOCUMENT_TITLE } from '/app/Constants';
import { getCurrentEntityType } from '/app/services/database/GetCurrentEntityType';

export function useDocumentTitle() {
  useEffect(() => {
    const tableTypeName = getCurrentEntityType()
      ? 'Projects'
      : 'Resources';
    document.title = DOCUMENT_TITLE + ` - ` + tableTypeName;
  }, []);
}
