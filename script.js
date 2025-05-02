document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.getElementById('export-pdf');

    exportButton?.addEventListener('click', () => {
        const day = document.querySelector('.day-input')?.value || '';
        const summary = document.querySelector('.summary-input')?.value || '';
        const date = document.querySelector('.date-input')?.value || '';

        // ✅ Updated checklist format using [x] / [ ]
        const checklist = Array.from(document.querySelectorAll('.checklist-items label')).map(label => {
            const checkbox = label.querySelector('input[type="checkbox"]');
            return `${checkbox.checked ? '[x]' : '[ ]'} ${label.textContent.trim()}`;
        });

        const entryCriteria = Array.from(document.querySelectorAll('.criteria-items label')).map(label => {
            const checkbox = label.querySelector('input[type="checkbox"]');
            const textarea = label.nextElementSibling;
            return {
                title: label.textContent.replace(':', '').trim(),
                checked: checkbox.checked,
                text: textarea?.value || ''
            };
        });

        const exitCriteria = {
            opposing: document.querySelector('.exit-items input[type="checkbox"]')?.checked,
            whySL: document.querySelectorAll('.exit-items textarea')[0]?.value || '',
            whyTP: document.querySelectorAll('.exit-items textarea')[1]?.value || ''
        };

        const results = Array.from(document.querySelectorAll('.results-table tbody tr')).map(row => {
            const cells = row.querySelectorAll('td');
            const inputs = row.querySelectorAll('input');
            return [
                cells[0]?.textContent || '',
                inputs[0]?.value || '',
                inputs[1]?.value || '',
                inputs[2]?.value || ''
            ];
        });

        const conclusions = Array.from(document.querySelectorAll('.conclusion-items textarea')).map(t => t.value);

        const docDefinition = {
            content: [
                { text: `Day: ${day}`, style: 'header' },
                { text: `Summary: ${summary}`, style: 'header' },
                { text: `Date: ${date}`, style: 'header', margin: [0, 0, 0, 10] },

                { text: 'Morning Checklist:', style: 'subheader' },
                { ul: checklist, margin: [0, 0, 0, 10] },

                { text: 'Entry Criteria:', style: 'subheader' },
                ...entryCriteria.flatMap(item => [
                    { text: `${item.checked ? '[x]' : '[ ]'} ${item.title}`, bold: true },
                    { text: item.text, margin: [20, 0, 0, 10] }
                ]),

                { text: 'Exit Criteria:', style: 'subheader', margin: [0, 10, 0, 5] },
                { text: `${exitCriteria.opposing ? '[x]' : '[ ]'} Opposing $ / Time Based Exit` },
                { text: 'WHY SL:', bold: true, margin: [0, 5, 0, 2] },
                { text: exitCriteria.whySL },
                { text: 'WHY TP:', bold: true, margin: [10, 5, 0, 2] },
                { text: exitCriteria.whyTP },

                { text: 'Results:', style: 'subheader', margin: [0, 10, 0, 5] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', '*', '*', '*'],
                        body: [
                            ['Trade', 'P/S', 'R/R', 'Realized R/R'],
                            ...results
                        ]
                    },
                    layout: 'lightHorizontalLines'
                },

                { text: 'Conclusions:', style: 'subheader', margin: [0, 10, 0, 5] },
                { text: 'Mistakes I Made:', bold: true },
                { text: conclusions[0] || '', margin: [20, 0, 0, 5] },
                { text: 'Well Did:', bold: true },
                { text: conclusions[1] || '', margin: [20, 0, 0, 5] },
                { text: 'Improvement:', bold: true },
                { text: conclusions[2] || '', margin: [20, 0, 0, 5] },
            ],
            styles: {
                header: { fontSize: 14, bold: true },
                subheader: { fontSize: 13, bold: true, margin: [0, 10, 0, 5] }
            }
        };

        pdfMake.createPdf(docDefinition).download(`journal-${date || 'entry'}.pdf`);
    });
});
