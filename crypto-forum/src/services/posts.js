
//TODO: Write function for getting the posts from the database(should return the data in the same format as the mock data below)
export const getPosts = async () => {
  return [
    {
      id: '1',
      title: 'Bitcoin Market Outlook for 2026',
      content:
        'What do you think about the Bitcoin market outlook over the next year? Share your thoughts and expectations.',
      author: 'testuser1',
      created_at: '2026-09-21T10:00:00Z',
    },
    {
      id: '2',
      title: 'Ethereum Scaling and Layer Two',
      content:
        'Ethereum Layer 2 networks continue to grow. Which scaling solution do you think has the strongest future?',
      author: 'testuser2',
      created_at: '2026-09-20T14:30:00Z',
    },
    {
      id: '3',
      title: 'Best Crypto Projects to Research',
      content:
        'Which cryptocurrency projects are currently worth researching? Share what makes each project interesting.',
      author: 'testuser3',
      created_at: '2026-09-19T09:15:00Z',
    },
    {
      id: '4',
      title: 'Crypto Trading Versus Investing',
      content:
        'Do you prefer actively trading cryptocurrency or holding investments for several years? Explain your reasoning.',
      author: 'testuser1',
      created_at: '2026-09-18T18:45:00Z',
    },
  ];
};