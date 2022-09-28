*** Settings ***
Library             Collections
Library             ../../libs/admin_api.py
Resource            ../../libs/admin-common.robot
Resource            ../../libs/admin/manage-content-common.robot
Resource            ../../libs/tables-common.robot

Suite Setup         user signs in as bau1
Suite Teardown      user closes the browser
Test Setup          fail test fast if required

Force Tags          Admin    Local    Dev    AltersData


*** Variables ***
${TOPIC_NAME}=                              %{TEST_TOPIC_NAME}
${PUBLICATION_NAME}=                        UI tests - prerelease %{RUN_IDENTIFIER}
${DATABLOCK_NAME}=                          UI test table
${DATABLOCK_FEATURED_NAME}=                 UI test featured table name
${DATABLOCK_FEATURED_TABLE_DESCRIPTION}=    UI test featured table description


*** Test Cases ***
Create test publication and release via API
    ${PUBLICATION_ID}=    user creates test publication via api    ${PUBLICATION_NAME}
    user create test release via api    ${PUBLICATION_ID}    CY    2000

Verify release summary
    user navigates to editable release summary from admin dashboard    ${PUBLICATION_NAME}
    ...    Calendar Year 2000 (not Live)
    user waits until h2 is visible    Release summary
    user checks page contains element    xpath://li/a[text()="Summary" and contains(@aria-current, 'page')]
    user checks summary list contains    Publication title    ${PUBLICATION_NAME}

Upload subject
    user uploads subject    UI test subject    upload-file-test.csv    upload-file-test.meta.csv

Add basic release content
    user clicks link    Content
    user waits until h1 is visible    ${PUBLICATION_NAME}
    user waits until h2 is visible    ${PUBLICATION_NAME}
    user adds basic release content    ${PUBLICATION_NAME}

Add public prerelease access list
    user clicks link    Pre-release access
    user waits until h2 is visible    Manage pre-release user access
    user creates public prerelease access list    Initial test public access list
