import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
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
    articles: ArticleEntity[];
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

  @ManyToOne(() => Category, category => category.articles)
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

  @Column()
  header_image?: string;

  @ManyToMany(type => Tag, tag => tag.articles)
  @JoinTable({
    name: 'article_tag',
    joinColumn: { name: 'article_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags: Tag[];

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
  key_part: string;

  @Column()
  article_id: number;

  @ManyToOne(() => ArticleEntity, article => article.media)
  @JoinColumn({
      name: 'article_id',
      referencedColumnName: 'id'
  })
  article: ArticleEntity;
}

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(type => ArticleEntity, article => article.tags)
  // only once is enough
  // @JoinTable({
  //   name: 'article_tag',
  //   joinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'article_id', referencedColumnName: 'id' }
  // })
  articles: ArticleEntity[];
}

@Entity()
export class ArticleTag {
  @PrimaryColumn({ name: 'article_id' })
  article_id: number;

  // @ManyToOne(type => ArticleEntity, article => article.tags)
  @PrimaryColumn({ name: 'tag_id' })
  tag_id: number;

  @ManyToOne(type => ArticleEntity, article => article.tags)
  @JoinColumn({ name: 'article_id', referencedColumnName: 'id' })
  article: ArticleEntity;
  // articles: ArticleEntity[];

  @ManyToOne(type => Tag, tag => tag.articles)
  @JoinColumn({ name: 'tag_id', referencedColumnName: 'id' })
  tag: Tag;
  // tags: Tag[];
}
