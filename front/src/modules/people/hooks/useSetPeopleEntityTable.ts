import { useLocation } from 'react-router-dom';
import { useRecoilCallback } from 'recoil';

import { GetPeopleQuery } from '~/generated/graphql';

import { peopleFilters } from '../../../pages/people/people-filters';
import { availableFiltersScopedState } from '../../ui/filter-n-sort/states/availableFiltersScopedState';
import { useContextScopeId } from '../../ui/recoil-scope/hooks/useContextScopeId';
import { currentPageLocationState } from '../../ui/states/currentPageLocationState';
import { useResetTableRowSelection } from '../../ui/table/hooks/useResetTableRowSelection';
import { entityTableDimensionsState } from '../../ui/table/states/entityTableDimensionsState';
import { isFetchingEntityTableDataState } from '../../ui/table/states/isFetchingEntityTableDataState';
import { TableContext } from '../../ui/table/states/TableContext';
import { tableRowIdsState } from '../../ui/table/states/tableRowIdsState';
import { peopleCityFamilyState } from '../states/peopleCityFamilyState';
import { peopleCompanyFamilyState } from '../states/peopleCompanyFamilyState';
import { peopleCreatedAtFamilyState } from '../states/peopleCreatedAtFamilyState';
import { peopleEmailFamilyState } from '../states/peopleEmailFamilyState';
import { peopleJobTitleFamilyState } from '../states/peopleJobTitleFamilyState';
import { peopleLinkedinUrlFamilyState } from '../states/peopleLinkedinUrlFamilyState';
import { peopleNameCellFamilyState } from '../states/peopleNamesFamilyState';
import { peoplePhoneFamilyState } from '../states/peoplePhoneFamilyState';
import { peopleColumns } from '../table/components/peopleColumns';

export function useSetPeopleEntityTable() {
  const resetTableRowSelection = useResetTableRowSelection();

  const tableContextScopeId = useContextScopeId(TableContext);

  const currentLocation = useLocation().pathname;

  return useRecoilCallback(
    ({ set, snapshot }) =>
      (newPeopleArray: GetPeopleQuery['people']) => {
        for (const person of newPeopleArray) {
          const currentEmail = snapshot
            .getLoadable(peopleEmailFamilyState(person.id))
            .valueOrThrow();

          if (currentEmail !== person.email) {
            set(peopleEmailFamilyState(person.id), person.email ?? null);
          }

          const currentCity = snapshot
            .getLoadable(peopleCityFamilyState(person.id))
            .valueOrThrow();

          if (currentCity !== person.city) {
            set(peopleCityFamilyState(person.id), person.city ?? null);
          }

          const currentCompany = snapshot
            .getLoadable(peopleCompanyFamilyState(person.id))
            .valueOrThrow();

          if (
            JSON.stringify(currentCompany) !== JSON.stringify(person.company)
          ) {
            set(peopleCompanyFamilyState(person.id), person.company);
          }

          const currentPhone = snapshot
            .getLoadable(peoplePhoneFamilyState(person.id))
            .valueOrThrow();

          if (currentPhone !== person.phone) {
            set(peoplePhoneFamilyState(person.id), person.phone ?? null);
          }

          const currentCreatedAt = snapshot
            .getLoadable(peopleCreatedAtFamilyState(person.id))
            .valueOrThrow();

          if (currentCreatedAt !== person.createdAt) {
            set(peopleCreatedAtFamilyState(person.id), person.createdAt);
          }

          const currentJobTitle = snapshot
            .getLoadable(peopleJobTitleFamilyState(person.id))
            .valueOrThrow();

          if (currentJobTitle !== person.jobTitle) {
            set(peopleJobTitleFamilyState(person.id), person.jobTitle ?? null);
          }

          const currentLinkedinUrl = snapshot
            .getLoadable(peopleLinkedinUrlFamilyState(person.id))
            .valueOrThrow();

          if (currentLinkedinUrl !== person.linkedinUrl) {
            set(
              peopleLinkedinUrlFamilyState(person.id),
              person.linkedinUrl ?? null,
            );
          }

          const currentNameCell = snapshot
            .getLoadable(peopleNameCellFamilyState(person.id))
            .valueOrThrow();

          if (
            currentNameCell.firstName !== person.firstName ||
            currentNameCell.lastName !== person.lastName ||
            currentNameCell.commentCount !== person._commentThreadCount
          ) {
            set(peopleNameCellFamilyState(person.id), {
              firstName: person.firstName ?? null,
              lastName: person.lastName ?? null,
              commentCount: person._commentThreadCount,
              displayName: person.displayName ?? null,
            });
          }
        }

        const peopleIds = newPeopleArray.map((people) => people.id);

        set(tableRowIdsState, (currentRowIds) => {
          if (JSON.stringify(currentRowIds) !== JSON.stringify(peopleIds)) {
            return peopleIds;
          }

          return currentRowIds;
        });

        resetTableRowSelection();

        set(entityTableDimensionsState, {
          numberOfColumns: peopleColumns.length,
          numberOfRows: peopleIds.length,
        });

        set(availableFiltersScopedState(tableContextScopeId), peopleFilters);

        set(currentPageLocationState, currentLocation);

        set(isFetchingEntityTableDataState, false);
      },
    [],
  );
}
