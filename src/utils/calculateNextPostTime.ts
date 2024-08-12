export default function calculateNextPostTime(lastPosted: Date, frequency: string): Date {
    const nextPost = new Date(lastPosted);
    switch (frequency) {
      case 'semanal':
        nextPost.setDate(nextPost.getDate() + 7);
        break;
      case 'mensal':
        nextPost.setMonth(nextPost.getMonth() + 1);
        break;
      case 'bimestral':
        nextPost.setMonth(nextPost.getMonth() + 2);
        break;
      case 'trimestral':
        nextPost.setMonth(nextPost.getMonth() + 3);
        break;
      case 'semestral':
        nextPost.setMonth(nextPost.getMonth() + 6);
        break;
    }
    return nextPost;
  }