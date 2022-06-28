import Button from '@common/components/Button';
import { FormFieldset } from '@common/components/form';
import { useFormContext } from '@common/components/form/contexts/FormContext';
import DragIcon from '@admin/prototypes/components/PrototypeDragIcon';
import FormFieldSortableList from '@admin/prototypes/components/PrototypeFormFieldSortableList';
import styles from '@admin/prototypes/components/PrototypeFormFieldSortableListGroup.module.scss';
import {
  CategoryFilter,
  LocationFilter,
  TimePeriodFilter,
  Filter,
} from '@common/modules/table-tool/types/filters';
import useToggle from '@common/hooks/useToggle';
import classNames from 'classnames';
import { useField } from 'formik';
import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const getGroupLegend = (group: Filter[]) => {
  if (group[0] instanceof CategoryFilter) {
    return group[0].category;
  }
  if (group[0] instanceof LocationFilter) {
    return 'Locations';
  }
  if (group[0] instanceof TimePeriodFilter) {
    return 'Time periods';
  }
  return 'Indicators';
};

interface Props<FormValues> {
  id?: string;
  hint?: string;
  isDraggingGroup: boolean;
  legend: string;
  name: FormValues extends Record<string, unknown> ? keyof FormValues : string;
  readOnly: boolean;
  onChangeReorderingType: (
    axisName: string,
    isReorderingGroups: boolean,
  ) => void;
  onMoveGroupToOtherAxis: (index: number) => void;
  onReorderingList: () => void;
}

function FormFieldSortableListGroup<FormValues>({
  hint,
  id: customId,
  isDraggingGroup = false,
  legend,
  name,
  readOnly = false,
  onMoveGroupToOtherAxis,
  onReorderingList,
}: Props<FormValues>) {
  const { prefixFormId, fieldId } = useFormContext();
  const id = customId ? prefixFormId(customId) : fieldId(name as string);

  const [field, meta] = useField(name as string);

  const [activeList, setActiveList] = useState<number | undefined>(undefined);

  return (
    <Droppable droppableId={name as string} direction="horizontal">
      {droppableProvided => (
        <div
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...droppableProvided.droppableProps}
          ref={droppableProvided.innerRef}
          className={classNames(styles.container, {
            [styles.dragActive]: isDraggingGroup,
          })}
          data-testid={id}
        >
          <FormFieldset
            id={id}
            legend={legend}
            legendWeight="regular"
            error={meta.error}
            legendSize="m"
            hint={hint}
          >
            <div
              className={classNames(styles.groupsContainer, {
                [styles.isActive]: !readOnly,
              })}
            >
              {field.value.length === 0 && (
                <div className="govuk-inset-text govuk-!-margin-0">
                  Add groups by dragging them here
                </div>
              )}

              {field.value.map((group: Filter[], index: number) => (
                <div
                  className={styles.groupContainer}
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                >
                  <Draggable
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    draggableId={`${name}-${index}`}
                    isDragDisabled={readOnly}
                    index={index}
                  >
                    {(draggableProvided, draggableSnapshot) => (
                      <div
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...draggableProvided.draggableProps}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...draggableProvided.dragHandleProps}
                        className={classNames(styles.group, {
                          [styles.isDragging]: draggableSnapshot.isDragging,
                          [styles.isDraggedOutside]:
                            draggableSnapshot.isDragging &&
                            !draggableSnapshot.draggingOver,
                          [styles.groupIsActive]: !readOnly,
                        })}
                        ref={draggableProvided.innerRef}
                        role={readOnly ? '' : 'button'}
                        tabIndex={readOnly ? -1 : 0}
                      >
                        <FormFieldSortableList
                          focus={activeList === index}
                          legend={
                            <>
                              {getGroupLegend(group)}
                              <DragIcon className={styles.dragIcon} />
                            </>
                          }
                          legendSize="s"
                          name={`${name}[${index}]`}
                          readOnly={activeList !== index}
                        />
                      </div>
                    )}
                  </Draggable>
                  {!isDraggingGroup && (
                    <div className={styles.buttonsContainer}>
                      {activeList === index ? (
                        <Button
                          onClick={e => {
                            e.preventDefault();
                            setActiveList(undefined);
                            onReorderingList();
                          }}
                        >
                          Done
                        </Button>
                      ) : (
                        <>
                          <Button
                            disabled={readOnly && activeList !== index}
                            onClick={e => {
                              e.preventDefault();
                              setActiveList(index);
                              onReorderingList();
                            }}
                          >
                            Re-order
                            <span className="govuk-visually-hidden">
                              {` items in ${getGroupLegend(group)}`}
                            </span>
                          </Button>
                          <Button
                            className={styles.moveButton}
                            disabled={readOnly}
                            onClick={e => {
                              e.preventDefault();
                              onMoveGroupToOtherAxis(index);
                            }}
                          >
                            Move{' '}
                            <span className="govuk-visually-hidden">
                              {getGroupLegend(group)}{' '}
                            </span>
                            to {name === 'rowGroups' ? 'columns' : 'rows'}
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {droppableProvided.placeholder}
            </div>
          </FormFieldset>
        </div>
      )}
    </Droppable>
  );
}

export default FormFieldSortableListGroup;
