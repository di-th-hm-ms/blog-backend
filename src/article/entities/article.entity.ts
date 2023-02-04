import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    // @Column()
    // description: string;

    @OneToMany(() => ArticleEntity, article => article.category)
    posts: ArticleEntity[];
}

@Entity()
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  title: string;

  @Column('text', { nullable: false })
  body: string;

  @Column({ nullable: false })
  summary: string;

  @CreateDateColumn()
  readonly created_at?: Date;

  @UpdateDateColumn()
  readonly updated_at?: Date;

  @Column()
  category_id: number;

  @ManyToOne(() => Category, category => category.posts)
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id'
  })
  category: Category;

  // @OneToMany(type => Comment, comment => comment.post)
  // comments: Comment[];

  @OneToMany(() => Media, media => media.article)
  media: Media[];

  @Column()
  slug: string;

  constructor(title: string, body: string) {
    this.title = title;
    this.body = body;
    this.slug = '';
  }
}



@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  type: 'image' | 'video';

  @Column({ nullable: false })
  key: string;

  @ManyToOne(() => ArticleEntity, article => article.media)
  @JoinColumn({
      name: 'article_id',
      referencedColumnName: 'id'
  })
  article: ArticleEntity;
}
