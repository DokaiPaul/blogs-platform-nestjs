import { HydratedDocument } from 'mongoose';
import { BlogViewModel } from '../api/models/view/blog.view.model';

export type BlogDocument = HydratedDocument<BlogViewModel>;
